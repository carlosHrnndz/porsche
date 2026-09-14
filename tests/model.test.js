'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const Model = require('../js/model.js');

const base = {
  owners:1,equityPerOwner:100000,ownerCost:0,chiefCost:0,ownerShare:0,
  chiefShare:1,presence:160,lifts:2,bayHours:160,horizon:36,tariff:100,
  partsRatio:0,partsMargin:0.3,demandStart:0,demandEnd:0,rampMonths:1,
  rent:0,otherFixed:0,marketing:0,recepMonth:0,loan:0,graceMonths:0,
  warrantyRate:0,annualInflation:0,taxRate:0,preopeningMonths:0,
  preopeningStaffCost:0,customerDays:0,supplierDays:0,seasonality:0,investments:[]
};
function run(changes) { return Model.simulate(Object.assign({},base,changes)); }
function near(actual, expected, tolerance=0.001) {
  assert.ok(Math.abs(actual-expected)<tolerance, `${actual} ≈ ${expected}`);
}
function asset(changes) {
  return Object.assign({id:'lift',name:'Elevador',amount:10000,vatRate:0.21,financed:false,depreciable:true,lifeMonths:100,category:'equipment'},changes);
}

test('full sales and cost of parts are separated from contribution margin', function () {
  const m=run({demandStart:100,demandEnd:100,partsRatio:0.67,partsMargin:0.5}).months[0];
  near(m.revenue,16700); near(m.partsCost,3350); near(m.ebitda,13350);
  near(m.laborRevenue+m.partsRevenue,m.revenue);
});

test('external loan is cash at inception, principal does not reduce accounting profit', function () {
  const noLoan=run(), loan=run({loan:12000,loanAPR:0,loanMonths:12});
  near(loan.summary.initialCash-noLoan.summary.initialCash,12000);
  near(loan.months[0].principal,1000);
  near(loan.months[0].netProfit,noLoan.months[0].netProfit);
  near(loan.months[0].cash-noLoan.months[0].cash,11000);
  near(loan.months[11].loans,0);
  near(loan.months[12].principal,0);
  near(loan.summary.endingCash,noLoan.summary.endingCash);
});

test('grace is inside total loan term and debt stops exactly at maturity', function () {
  const r=run({loan:12000,loanAPR:0.12,loanMonths:12,graceMonths:3});
  r.months.slice(0,3).forEach(function (m) { near(m.interest,120); near(m.principal,0); });
  assert.ok(r.months[3].principal>0);
  near(r.months[11].loans,0);
  near(r.months[12].interest+r.months[12].principal,0);
  near(r.months.reduce((s,m)=>s+m.principal,0),12000);
});

test('equipment finance funds only the net asset, with VAT still paid upfront', function () {
  const bought=run({investments:[asset()]}), financed=run({investments:[asset({financed:true})],equipmentFinanceAPR:0,equipmentFinanceMonths:10});
  near(bought.summary.initialCash,87900);
  near(financed.summary.initialCash,97900);
  near(financed.summary.financedEquipment,10000);
  near(financed.months[0].equipmentLoan,9000);
  near(financed.months[0].depreciation,bought.months[0].depreciation);
  near(financed.months[9].equipmentLoan,0);
  near(financed.months[10].debtPayment,0);
});

test('CAPEX VAT credit is carried without an automatic month-four refund', function () {
  const r=run({investments:[asset()]});
  r.months.forEach(function (m) { near(m.cash,87900); near(m.vatPayment,0); near(m.vatCredit,2100); });
  near(r.summary.endingCash,r.summary.initialCash);
});

test('VAT is paid only after the actual calendar quarter and offsets input credit', function () {
  const r=run({openingDate:'2028-09-01',horizon:5,demandStart:100,demandEnd:100,investments:[asset()]});
  near(r.months[0].vatPayment,0);
  near(r.months[1].vatPayment,0); // September VAT offsets initial CAPEX VAT.
  near(r.months[3].vatPayment,0);
  near(r.months[4].vatPayment,6300); // October–December, paid in January.
});

test('capacity is limited by both technical capacity and usable lift hours', function () {
  const technical=run({chiefShare:0.7,ownerShare:0.8,noviceStart:0.35,noviceEnd:0.35,demandStart:500,demandEnd:500});
  near(technical.months[0].hours,156.8);
  const bays=run({lifts:1,bayHours:80,demandStart:500,demandEnd:500});
  near(bays.months[0].hours,80);
  const noBays=run({lifts:0,demandStart:100,demandEnd:100});
  near(noBays.months[0].revenue,0);
});

test('adding a second owner adds capital and pay, never extra customer demand', function () {
  const config={ownerCost:3300,ownerShare:0.8,noviceStart:0.35,noviceEnd:0.7,demandStart:65,demandEnd:65};
  const one=run(config), two=run(Object.assign({},config,{owners:2}));
  near(two.summary.initialCash-one.summary.initialCash,100000);
  near(two.months[0].demand,one.months[0].demand);
  near(two.months[0].revenue,one.months[0].revenue);
  near(two.months[0].staffCost-one.months[0].staffCost,3300);
  assert.ok(two.months[0].capacity>one.months[0].capacity);
});

test('preopening rent and preparatory staff are cash costs with only rent VAT', function () {
  const r=run({rent:2000,preopeningMonths:3,preopeningStaffCost:1000});
  near(r.summary.preopeningCost,9000);
  near(r.summary.preopeningVAT,1260);
  near(r.summary.initialCash,89740);
  near(r.summary.preopeningExpense,9000);
});

test('deposit has neither VAT nor depreciation and VAT-exempt fees stay exempt', function () {
  const r=run({investments:[asset({id:'deposit',amount:5000,vatRate:0,financed:false,depreciable:false,lifeMonths:0,category:'deposit'}),asset({id:'fee',amount:2000,vatRate:0,depreciable:false,lifeMonths:0,category:'fees'})]});
  near(r.summary.investmentVAT,0); near(r.summary.initialCash,93000);
  near(r.months[0].depreciation,0); near(r.summary.preopeningExpense,2000);
});

test('working capital with 45-day terms splits receipts and reconciles debtors', function () {
  const r=run({horizon:3,demandStart:100,demandEnd:100,customerDays:45});
  near(r.months[0].customerReceipts,0); near(r.months[0].receivables,12100);
  near(r.months[1].customerReceipts,6050); near(r.months[1].receivables,18150);
  near(r.months[2].customerReceipts,12100); near(r.months[2].receivables,18150);
});

test('supplier payment delay affects cash and creditors, not profit', function () {
  const same={horizon:3,demandStart:100,demandEnd:100,partsRatio:1,partsMargin:0.5};
  const cash=run(same), credit=run(Object.assign({},same,{supplierDays:30}));
  near(cash.months[0].netProfit,credit.months[0].netProfit);
  near(credit.months[0].payables,6050);
  near(credit.months[0].cash-cash.months[0].cash,6050);
  near(credit.months[1].supplierPayments,6050);
});

test('fiscal year follows calendar and tax is paid the following July', function () {
  const r=run({openingDate:'2028-09-01',horizon:12,demandStart:100,demandEnd:100,taxRate:0.2});
  near(r.months[0].taxAccrued,2000); near(r.months[0].netProfit,8000);
  near(r.months[3].taxesPayable,8000);
  near(r.months[9].taxPayment,0); near(r.months[10].taxPayment,8000);
  near(r.months[11].taxPayment,0);
});

test('prior fiscal losses offset subsequent profits before any tax is charged', function () {
  const r=run({openingDate:'2028-12-01',horizon:3,chiefCost:1000,demandStart:0,demandEnd:20,rampMonths:2,taxRate:0.2});
  near(r.months[0].lossCarry,1000);
  near(r.months[1].profitBeforeTax,1000); near(r.months[1].taxAccrued,0);
  near(r.months[2].taxAccrued,200);
});

test('depreciation ends at useful life; loan principal remains separate', function () {
  const r=run({investments:[asset({amount:1200,vatRate:0,lifeMonths:2})],horizon:3});
  near(r.months[0].depreciation,600); near(r.months[1].depreciation,600); near(r.months[2].depreciation,0);
  near(r.months[0].cash,r.summary.initialCash);
  near(r.months[0].netProfit,-600);
});

test('warranty provision and expenditure are distinct and never double-count cash', function () {
  const r=run({demandStart:100,demandEnd:100,warrantyRate:0.02,warrantySpendRate:0});
  near(r.months[0].warrantyExpense,200); near(r.months[0].warrantySpent,0);
  near(r.months[0].warrantyReserve,200); near(r.months[0].netProfit,9800);
  const spent=run({demandStart:100,demandEnd:100,warrantyRate:0.02});
  near(spent.months[0].warrantyReserve,0);
  near(r.months[0].cash-spent.months[0].cash,200);
});

test('minimum funding covers the lowest cash point plus reserve, not just final cash', function () {
  const r=run({equityPerOwner:1000,chiefCost:1000,horizon:3,cashReserveTarget:500});
  near(r.summary.lowestCash,-2000); near(r.summary.requiredEquity,3500);
  near(r.summary.additionalFunding,2500);
  near(run({equityPerOwner:3500,chiefCost:1000,horizon:3,cashReserveTarget:500}).summary.lowestCash,500);
});

test('sustained equilibrium requires three consecutive profitable months', function () {
  const r=run({demandStart:20,demandEnd:20,chiefCost:1000});
  assert.equal(r.summary.firstPositiveMonth,1); assert.equal(r.summary.sustainedBreakEvenMonth,3);
  const loss=run({chiefCost:1000});
  assert.equal(loss.summary.firstPositiveMonth,null); assert.equal(loss.summary.sustainedBreakEvenMonth,null);
});

test('cash movements reconcile and default inputs are not mutated', function () {
  const before=JSON.stringify(Model.defaults), assetsBefore=JSON.stringify(Model.defaultInvestments);
  const r=Model.simulate();
  assert.equal(r.months[0].date,'2028-09-01');
  assert.equal(r.months.length,36);
  r.months.forEach(function (m) {
    near(m.cash-m.startingCash,m.operatingCash-m.interest-m.principal);
    near(m.netProfit,m.ebitda-m.depreciation-m.interest-m.taxAccrued);
    assert.ok(Number.isFinite(m.cash));
  });
  assert.equal(JSON.stringify(Model.defaults),before);
  assert.equal(JSON.stringify(Model.defaultInvestments),assetsBefore);
});

test('invalid inputs produce helpful errors instead of NaN projections', function () {
  assert.throws(()=>run({loanMonths:12,graceMonths:12}),/graceMonths/);
  assert.throws(()=>run({customerDays:61}),/60 días/);
  assert.throws(()=>run({openingDate:'2028-13-01'}),/openingDate/);
  assert.throws(()=>run({ownerShare:1}),/20 %/);
  assert.throws(()=>run({investments:[asset({lifeMonths:0})]}),/vida útil/);
  assert.throws(()=>run({investments:[asset({lifeMonths:2.5})]}),/meses enteros/);
});

test('browser UMD export works without Node globals or network dependencies', function () {
  const context=vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(__dirname,'../js/model.js'),'utf8'),context);
  assert.equal(typeof context.WorkshopModel.simulate,'function');
  const r=context.WorkshopModel.simulate({owners:2});
  assert.equal(r.months.length,36);
  assert.ok(Number.isFinite(r.summary.endingCash));
});

test('very small interest rates stay finite instead of dividing by a rounded zero', function () {
  const r=run({loan:12000,loanAPR:1e-20,loanMonths:12});
  near(r.months[0].principal,1000);
  near(r.months[11].loans,0);
});

test('August scales demand and both capacity constraints, while fixed costs remain whole', function () {
  const config={seasonality:1,horizon:1,demandStart:100,demandEnd:100,chiefCost:5500,ownerCost:3300,rent:2500};
  const august=run(Object.assign({},config,{openingDate:'2028-08-01'})).months[0];
  const september=run(Object.assign({},config,{openingDate:'2028-09-01'})).months[0];
  near(august.seasonFactor,0.55);
  near(august.demand,september.demand*0.55);
  near(august.technicianCapacity,september.technicianCapacity*0.55);
  near(august.bayCapacity,september.bayCapacity*0.55);
  near(august.revenue,september.revenue*0.55);
  near(august.fixedCosts,september.fixedCosts);
});

test('December factor is editable and disabling seasonality leaves equivalent opening months', function () {
  const config={horizon:1,demandStart:100,demandEnd:100};
  const december=run(Object.assign({},config,{openingDate:'2028-12-01',seasonality:1,decemberFactor:0.8})).months[0];
  near(december.demand,80); near(december.capacity,128);
  const august=run(Object.assign({},config,{openingDate:'2028-08-01'})).months[0];
  const september=run(Object.assign({},config,{openingDate:'2028-09-01'})).months[0];
  near(august.demand,september.demand); near(august.capacity,september.capacity);
  near(august.netProfit,september.netProfit); near(august.cash,september.cash);
  assert.throws(()=>run({augustFactor:1.1}),/augustFactor/);
  assert.throws(()=>run({decemberFactor:-0.1}),/decemberFactor/);
});
