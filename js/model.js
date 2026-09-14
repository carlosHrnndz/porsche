/* Independent workshop planning model. Monetary inputs are net of VAT. */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.WorkshopModel = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const defaults = Object.freeze({
    owners: 1, equityPerOwner: 80000, ownerCost: 3300, chiefCost: 5500,
    ownerShare: 0.8, noviceStart: 0.35, noviceEnd: 0.70, noviceMonths: 18,
    chiefShare: 0.70, presence: 160, lifts: 2, bayHours: 140,
    openingDate: '2028-09-01', horizon: 36, tariff: 105,
    seasonality: 1, augustFactor: 0.55, decemberFactor: 0.85,
    partsRatio: 0.67, partsMargin: 0.30, demandStart: 65, demandEnd: 230,
    rampMonths: 24, rent: 2500, otherFixed: 1800, marketing: 650,
    recepMonth: 0, recepCost: 2500, loan: 40000, loanAPR: 0.065,
    loanMonths: 72, graceMonths: 6, equipmentFinanceAPR: 0.075,
    equipmentFinanceMonths: 60, vatRate: 0.21, warrantyRate: 0.02,
    warrantySpendRate: null, annualInflation: 0.03, taxRate: 0.20,
    cashReserveTarget: 25000, preopeningMonths: 3, preopeningStaffCost: 2000,
    customerDays: 0, supplierDays: 15, otherFixedVatShare: 0.65
  });

  const defaultInvestments = Object.freeze([
    {id:'fitout', name:'Obra y adecuación', amount:25000, vatRate:0.21, financed:false, depreciable:true, lifeMonths:120, category:'fitout'},
    {id:'lifts', name:'Dos elevadores instalados', amount:12000, vatRate:0.21, financed:true, depreciable:true, lifeMonths:120, category:'equipment'},
    {id:'tools', name:'Herramientas y útiles', amount:12000, vatRate:0.21, financed:false, depreciable:true, lifeMonths:96, category:'equipment'},
    {id:'diagnosis', name:'Diagnosis y acceso inicial', amount:9000, vatRate:0.21, financed:false, depreciable:true, lifeMonths:60, category:'equipment'},
    {id:'air', name:'Compresor y red neumática', amount:5000, vatRate:0.21, financed:false, depreciable:true, lifeMonths:96, category:'equipment'},
    {id:'aircon', name:'Equipo de aire acondicionado', amount:4500, vatRate:0.21, financed:false, depreciable:true, lifeMonths:96, category:'equipment'},
    {id:'fluids', name:'Extracción, fluidos y auxiliares', amount:6000, vatRate:0.21, financed:false, depreciable:true, lifeMonths:120, category:'equipment'},
    {id:'safety', name:'Seguridad e incendios', amount:4000, vatRate:0.21, financed:false, depreciable:true, lifeMonths:120, category:'equipment'},
    {id:'it', name:'Informática y gestión inicial', amount:2500, vatRate:0.21, financed:false, depreciable:true, lifeMonths:36, category:'equipment'},
    {id:'furniture', name:'Recepción y mobiliario', amount:2500, vatRate:0.21, financed:false, depreciable:true, lifeMonths:96, category:'equipment'},
    {id:'sign', name:'Rotulación', amount:2000, vatRate:0.21, financed:false, depreciable:true, lifeMonths:60, category:'equipment'},
    {id:'project', name:'Proyecto técnico y preparación', amount:5000, vatRate:0.21, financed:false, depreciable:false, lifeMonths:0, category:'fees'},
    {id:'fees', name:'Tasas estimadas', amount:2500, vatRate:0, financed:false, depreciable:false, lifeMonths:0, category:'fees'},
    {id:'deposit', name:'Fianza recuperable del local', amount:5000, vatRate:0, financed:false, depreciable:false, lifeMonths:0, category:'deposit'},
    {id:'stock', name:'Existencias iniciales', amount:4000, vatRate:0.21, financed:false, depreciable:false, lifeMonths:0, category:'stock'}
  ].map(Object.freeze));

  const assumptions = Object.freeze([
    'Escenario de planificación para septiembre de 2028; precios, condiciones financieras y fiscalidad deben actualizarse antes de comprometer inversión.',
    'Aportación y costes de socios son independientes: 3.300 €/mes por socio es un presupuesto de coste empresa para un objetivo de 2.000 € netos, no un cálculo exacto de IRPF o cotización.',
    'El jefe dedica el porcentaje indicado a producción. Cada socio combina su dedicación mecánica con un rendimiento de aprendizaje; la demanda de clientes es común e independiente de la plantilla.',
    'La capacidad es el menor de horas productivas del equipo y horas útiles de los elevadores. Las horas mensuales útiles deben incluir descansos, tareas internas y ocupación del puesto por espera de piezas.',
    'Con estacionalidad activada, agosto y diciembre reducen tanto la demanda como la capacidad técnica y de elevadores mediante factores editables (55 % y 85 % por defecto); los costes fijos continúan íntegros. Es un supuesto de vacaciones y cierre parcial, no una serie histórica del mercado de Madrid. Evita descontar otra vez esas mismas vacaciones de las horas de presencia.',
    'El precio de venta se mantiene constante. Salarios, alquiler, servicios, marketing y recepción suben con la inflación cada aniversario; la demanda crece linealmente hasta su objetivo.',
    'La financiación de equipos es un préstamo por el precio neto del activo, no un leasing jurídico ni fiscal. El IVA íntegro se paga al inicio. Los plazos incluyen la carencia y todas las cuotas terminan al vencimiento.',
    'Los cobros y pagos de recambios se aproximan repartiendo facturas entre meses según días/30, con máximo 60 días. Los demás gastos operativos se pagan en el mes. No se modelan impagos.',
    'El IVA se devenga con las facturas y se liquida trimestralmente en el mes siguiente. El crédito negativo se compensa, nunca se devuelve automáticamente en efectivo. Se supone IVA deducible íntegro en partidas sujetas, incluyendo alquiler y marketing; la fracción indicada de otros gastos soporta IVA.',
    'El impuesto sobre beneficios utiliza un tipo plano editable como supuesto futuro, compensación de pérdidas y pago en julio del año siguiente. No reproduce tipos especiales, límites fiscales ni pagos fraccionados. Los gastos anteriores a apertura se incorporan al primer ejercicio proyectado.',
    'La amortización es lineal por vida útil presupuestada desde apertura, independiente de la financiación. Fianza y stock no se amortizan. Los gastos iniciales identificados como fees o preopening son gasto previo a apertura.',
    'La garantía se provisiona como porcentaje de ventas de servicio. Por defecto se supone el mismo gasto efectivo mensual; si se indica otra tasa de gasto, la diferencia queda como obligación de garantía y no se resta dos veces de caja.',
    'Antes de apertura se pagan los meses indicados de alquiler y personal preparatorio, además del presupuesto inicial. No se incluyen subvenciones. La reserva de caja es un objetivo, no un gasto.',
    'El equilibrio sostenido se confirma al terminar tres meses consecutivos con beneficio neto no negativo. El resultado anual muestra los últimos doce meses proyectados y no garantiza que el negocio haya madurado.'
  ]);

  function merge(input) {
    const c = Object.assign({}, defaults, input || {});
    c.investments = (input && input.investments !== undefined ? input.investments : defaultInvestments);
    return c;
  }

  function validate(input) {
    const c = merge(input);
    const errors = [];
    Object.keys(defaults).forEach(function (key) {
      if (key === 'openingDate' || (key === 'warrantySpendRate' && c[key] === null)) return;
      if (!Number.isFinite(c[key]) || c[key] < 0) errors.push(key + ': debe ser un número no negativo.');
    });
    ['ownerShare','noviceStart','noviceEnd','chiefShare','partsMargin','vatRate','warrantyRate','annualInflation','taxRate','otherFixedVatShare','loanAPR','equipmentFinanceAPR','augustFactor','decemberFactor'].forEach(function (key) {
      if (c[key] > 1) errors.push(key + ': usa una fracción entre 0 y 1.');
    });
    if (c.warrantySpendRate !== null && c.warrantySpendRate > 1) errors.push('warrantySpendRate: usa una fracción entre 0 y 1.');
    if (![1,2].includes(c.owners)) errors.push('owners: elige uno o dos socios.');
    if (![0,1].includes(c.seasonality)) errors.push('seasonality: usa 0 para desactivar o 1 para activar.');
    if (c.ownerShare > 0.8) errors.push('ownerShare: reserva al menos un 20 % de jornada para gestión.');
    if (!Number.isInteger(c.horizon) || c.horizon < 1 || c.horizon > 120) errors.push('horizon: debe ser de 1 a 120 meses.');
    ['loanMonths','equipmentFinanceMonths','rampMonths','noviceMonths'].forEach(function (key) {
      if (!Number.isInteger(c[key]) || c[key] < 1) errors.push(key + ': debe ser un número entero positivo.');
    });
    ['lifts','graceMonths','recepMonth','preopeningMonths'].forEach(function (key) {
      if (!Number.isInteger(c[key])) errors.push(key + ': debe ser un número entero.');
    });
    if (c.graceMonths >= c.loanMonths) errors.push('graceMonths: debe ser menor que el plazo total del préstamo.');
    if (c.customerDays > 60 || c.supplierDays > 60) errors.push('Plazos comerciales: el máximo del modelo es 60 días.');
    if (c.presence <= 0 || c.bayHours <= 0 || c.tariff <= 0) errors.push('Horas y tarifa deben ser positivas.');
    if (c.noviceEnd < c.noviceStart) errors.push('noviceEnd: no puede ser menor que el rendimiento inicial.');
    if (!/^\d{4}-\d{2}(?:-01)?$/.test(c.openingDate || '') || Number(c.openingDate.slice(5,7)) < 1 || Number(c.openingDate.slice(5,7)) > 12 || Number(c.openingDate.slice(0,4)) < 2000) errors.push('openingDate: usa AAAA-MM o AAAA-MM-01.');
    if (!Array.isArray(c.investments)) errors.push('investments: debe ser una lista.');
    else {
      const ids = new Set();
      c.investments.forEach(function (item, index) {
        const prefix = 'Inversión ' + (index + 1) + ': ';
        if (!item || typeof item !== 'object') { errors.push(prefix + 'partida inválida.'); return; }
        if (!item.id || ids.has(item.id)) errors.push(prefix + 'identificador ausente o repetido.');
        ids.add(item.id);
        if (!Number.isFinite(item.amount) || item.amount < 0) errors.push(prefix + 'importe inválido.');
        if (!Number.isFinite(item.vatRate) || item.vatRate < 0 || item.vatRate > 1) errors.push(prefix + 'IVA inválido.');
        if (typeof item.financed !== 'boolean' || typeof item.depreciable !== 'boolean') errors.push(prefix + 'financed y depreciable deben ser booleanos.');
        if (item.depreciable && (!Number.isInteger(item.lifeMonths) || item.lifeMonths <= 0)) errors.push(prefix + 'vida útil inválida: indica meses enteros positivos.');
      });
    }
    return errors;
  }

  function payment(balance, apr, count) {
    if (balance <= 0) return 0;
    const r = apr / 12;
    return r ? balance * r / -Math.expm1(-count * Math.log1p(r)) : balance / count;
  }

  function loanSchedule(amount, apr, term, grace, horizon) {
    let balance = amount;
    const quota = payment(amount, apr, term - grace);
    const result = [];
    for (let i=0; i<horizon; i++) {
      const interest = i < term ? balance * apr / 12 : 0;
      let principal = 0;
      if (i >= grace && i < term) principal = i === term-1 ? balance : Math.min(balance, Math.max(0, quota-interest));
      balance = Math.max(0, balance-principal);
      result.push({interest:interest, principal:principal, payment:interest+principal, balance:balance});
    }
    return result;
  }

  function addTimed(queue, index, amount, days) {
    const delay = days / 30;
    const whole = Math.floor(delay);
    const fraction = delay-whole;
    queue[index+whole] = (queue[index+whole] || 0) + amount * (1-fraction);
    queue[index+whole+1] = (queue[index+whole+1] || 0) + amount * fraction;
  }

  function sum(items, key) { return items.reduce(function (total,item) { return total + item[key]; }, 0); }
  function money(value) { return Math.round((value + Number.EPSILON) * 100) / 100; }
  function ramp(start, end, months, i) { return start + (end-start) * (months === 1 ? 1 : Math.min(1, i/(months-1))); }

  function simulate(input) {
    const c = merge(input);
    const errors = validate(c);
    if (errors.length) { const error = new Error(errors.join(' ')); error.name = 'WorkshopConfigError'; throw error; }
    c.investments = c.investments.map(function (item) { return Object.assign({},item); });
    const totalInvestment = sum(c.investments,'amount');
    const investmentVAT = c.investments.reduce(function (s,a) { return s+a.amount*a.vatRate; },0);
    const financedEquipment = c.investments.reduce(function (s,a) { return s+(a.financed?a.amount:0); },0);
    const initialExpense = c.investments.reduce(function (s,a) { return s+(!a.depreciable && ['fees','preopening'].includes(a.category)?a.amount:0); },0);
    const preopeningCost = c.preopeningMonths * (c.rent+c.preopeningStaffCost);
    const preopeningVAT = c.preopeningMonths * c.rent * c.vatRate;
    const totalEquity = c.owners*c.equityPerOwner;
    const upfrontCash = totalInvestment + investmentVAT + preopeningCost + preopeningVAT - financedEquipment;
    const initialCash = totalEquity+c.loan-upfrontCash;
    let cash = initialCash, lowestCash = initialCash, lowestMonth = 0;
    const generalLoan = loanSchedule(c.loan,c.loanAPR,c.loanMonths,c.graceMonths,c.horizon);
    const equipmentLoan = loanSchedule(financedEquipment,c.equipmentFinanceAPR,c.equipmentFinanceMonths,0,c.horizon);
    const receiptsQueue = [], suppliersQueue = [], vatQueue = [], taxSchedule = {};
    let receivables=0, payables=0, vatCredit=investmentVAT+preopeningVAT, quarterVAT=0;
    let lossCarry=0, yearProfit=-(preopeningCost+initialExpense), yearTaxAccrued=0, warrantyReserve=0;
    let firstPositiveMonth=null, sustainedBreakEvenMonth=null, positiveStreak=0;
    const months=[];
    const startYear=Number(c.openingDate.slice(0,4)), startMonth=Number(c.openingDate.slice(5,7))-1;
    const names=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

    for (let i=0; i<c.horizon; i++) {
      const calendar = new Date(Date.UTC(startYear,startMonth+i,1));
      const year=calendar.getUTCFullYear(), month=calendar.getUTCMonth();
      const inflation=Math.pow(1+c.annualInflation,Math.floor(i/12));
      const seasonFactor=c.seasonality ? (month===7?c.augustFactor:(month===11?c.decemberFactor:1)):1;
      const noviceEfficiency=ramp(c.noviceStart,c.noviceEnd,c.noviceMonths,i);
      const chiefCapacity=c.presence*c.chiefShare*seasonFactor;
      const ownerCapacity=c.presence*c.owners*c.ownerShare*noviceEfficiency*seasonFactor;
      const technicianCapacity=chiefCapacity+ownerCapacity;
      const bayCapacity=c.lifts*c.bayHours*seasonFactor;
      const capacity=Math.min(technicianCapacity,bayCapacity);
      const demand=ramp(c.demandStart,c.demandEnd,c.rampMonths,i)*seasonFactor;
      const hours=Math.min(capacity,demand);
      const laborRevenue=hours*c.tariff;
      const partsRevenue=laborRevenue*c.partsRatio;
      const revenue=laborRevenue+partsRevenue;
      const partsCost=partsRevenue*(1-c.partsMargin);
      const staffCost=(c.owners*c.ownerCost+c.chiefCost)*inflation;
      const receptionCost=c.recepMonth>0 && i+1>=c.recepMonth ? c.recepCost*inflation:0;
      const rent=c.rent*inflation, otherFixed=c.otherFixed*inflation, marketing=c.marketing*inflation;
      const fixedCosts=staffCost+receptionCost+rent+otherFixed+marketing;
      const warrantyAccrued=revenue*c.warrantyRate;
      const warrantySpent=revenue*(c.warrantySpendRate === null?c.warrantyRate:c.warrantySpendRate);
      const warrantyExpense=Math.max(warrantyAccrued,warrantySpent-warrantyReserve);
      warrantyReserve=Math.max(0,warrantyReserve+warrantyExpense-warrantySpent);
      const ebitda=revenue-partsCost-fixedCosts-warrantyExpense;
      const depreciation=c.investments.reduce(function (s,a) { return s+(a.depreciable && i<a.lifeMonths?a.amount/a.lifeMonths:0); },0);
      const interest=generalLoan[i].interest+equipmentLoan[i].interest;
      const principal=generalLoan[i].principal+equipmentLoan[i].principal;
      const ebit=ebitda-depreciation;
      const profitBeforeTax=ebit-interest;
      yearProfit+=profitBeforeTax;
      const yearTax=Math.max(0,yearProfit-lossCarry)*c.taxRate;
      const taxAccrued=yearTax-yearTaxAccrued;
      yearTaxAccrued=yearTax;
      const netProfit=profitBeforeTax-taxAccrued;
      const taxPayment=month===6 ? (taxSchedule[year] || 0) : 0;
      if (month===6) delete taxSchedule[year];
      if (month===11) {
        taxSchedule[year+1]=(taxSchedule[year+1] || 0)+yearTax;
        lossCarry=yearProfit<0 ? lossCarry-yearProfit : Math.max(0,lossCarry-yearProfit);
        yearProfit=0; yearTaxAccrued=0;
      }

      const outputVAT=revenue*c.vatRate;
      const partsVAT=partsCost*c.vatRate;
      const fixedVAT=(rent+marketing+otherFixed*c.otherFixedVatShare)*c.vatRate;
      const inputVAT=partsVAT+fixedVAT;
      const vatPayment=vatQueue[i] || 0;
      quarterVAT+=outputVAT-inputVAT;
      if (month%3===2) {
        const netVAT=quarterVAT-vatCredit;
        vatQueue[i+1]=Math.max(0,netVAT);
        vatCredit=Math.max(0,-netVAT);
        quarterVAT=0;
      }
      addTimed(receiptsQueue,i,revenue+outputVAT,c.customerDays);
      addTimed(suppliersQueue,i,partsCost+partsVAT,c.supplierDays);
      const customerReceipts=receiptsQueue[i] || 0;
      const supplierPayments=suppliersQueue[i] || 0;
      receivables=Math.max(0,receivables+revenue+outputVAT-customerReceipts);
      payables=Math.max(0,payables+partsCost+partsVAT-supplierPayments);
      const fixedCash=fixedCosts+fixedVAT;
      const operatingCash=customerReceipts-supplierPayments-fixedCash-warrantySpent-vatPayment-taxPayment;
      const cashChange=operatingCash-interest-principal;
      const startingCash=cash;
      cash+=cashChange;
      if (cash<lowestCash) { lowestCash=cash; lowestMonth=i+1; }
      if (netProfit>0 && firstPositiveMonth===null) firstPositiveMonth=i+1;
      positiveStreak=netProfit>=0 ? positiveStreak+1:0;
      if (positiveStreak>=3 && sustainedBreakEvenMonth===null) sustainedBreakEvenMonth=i+1;
      const loans=generalLoan[i].balance+equipmentLoan[i].balance;
      const unpaidVAT=Math.max(0,quarterVAT-vatCredit)+(vatQueue[i+1] || 0);
      const taxesPayable=Object.keys(taxSchedule).reduce(function (s,k) { return s+taxSchedule[k]; },0)+yearTaxAccrued;
      months.push({
        m:i+1,date:calendar.toISOString().slice(0,10),label:names[month]+' '+year,seasonFactor:seasonFactor,
        capacity:capacity,technicianCapacity:technicianCapacity,bayCapacity:bayCapacity,
        chiefCapacity:chiefCapacity,ownerCapacity:ownerCapacity,noviceEfficiency:noviceEfficiency,
        demand:demand,hours:hours,unservedHours:Math.max(0,demand-hours),utilization:capacity?hours/capacity:0,
        laborRevenue:laborRevenue,partsRevenue:partsRevenue,revenue:revenue,partsCost:partsCost,
        staffCost:staffCost,receptionCost:receptionCost,rent:rent,otherFixed:otherFixed,marketing:marketing,
        fixedCosts:fixedCosts,warrantyAccrued:warrantyAccrued,warrantyExpense:warrantyExpense,
        warrantySpent:warrantySpent,warrantyReserve:warrantyReserve,ebitda:ebitda,
        depreciation:depreciation,ebit:ebit,interest:interest,profitBeforeTax:profitBeforeTax,
        taxAccrued:taxAccrued,netProfit:netProfit,vatPayment:vatPayment,taxPayment:taxPayment,
        principal:principal,debtPayment:principal+interest,operatingCash:operatingCash,cashChange:cashChange,
        startingCash:startingCash,cash:cash,loans:loans,generalLoan:generalLoan[i].balance,
        equipmentLoan:equipmentLoan[i].balance,vatCredit:Math.max(0,vatCredit-quarterVAT),
        vatPayable:unpaidVAT,taxesPayable:taxesPayable,receivables:receivables,payables:payables,
        customerReceipts:customerReceipts,supplierPayments:supplierPayments,fixedCash:fixedCash,
        outputVAT:outputVAT,inputVAT:inputVAT,lossCarry:lossCarry
      });
    }

    const last=months[months.length-1], last12=months.slice(-12);
    const annualizer=12/last12.length;
    const effectiveWarrantyRate=last.revenue ? last.warrantyExpense/last.revenue:c.warrantyRate;
    const hourlyContribution=c.tariff*(1+c.partsRatio*c.partsMargin-(1+c.partsRatio)*effectiveWarrantyRate);
    const breakEvenHours=hourlyContribution>0 ? (last.fixedCosts+last.depreciation+last.interest)/hourlyContribution:null;
    const cashBreakEvenHours=hourlyContribution>0 ? (last.fixedCosts+last.interest+last.principal)/hourlyContribution:null;
    const requiredEquity=Math.max(0,totalEquity+c.cashReserveTarget-lowestCash);
    const additionalFunding=Math.max(0,requiredEquity-totalEquity);
    const summary={
      initialCash:initialCash,lowestCash:lowestCash,lowestMonth:lowestMonth,endingCash:cash,
      firstPositiveMonth:firstPositiveMonth,sustainedBreakEvenMonth:sustainedBreakEvenMonth,
      annualRevenue:sum(last12,'revenue')*annualizer,annualProfit:sum(last12,'netProfit')*annualizer,
      annualEBITDA:sum(last12,'ebitda')*annualizer,breakEvenHours:breakEvenHours,cashBreakEvenHours:cashBreakEvenHours,
      requiredEquity:requiredEquity,totalEquity:totalEquity,totalInvestment:totalInvestment,
      financedEquipment:financedEquipment,investmentVAT:investmentVAT,upfrontCash:upfrontCash,
      preopeningCost:preopeningCost,preopeningVAT:preopeningVAT,preopeningExpense:preopeningCost+initialExpense,
      monthlyDebt:months[0].debtPayment,monthlyDebtAfterGrace:months[Math.min(c.graceMonths,c.horizon-1)].debtPayment,
      lastDebt:last.loans,totalCapacity:last.capacity,additionalFunding:additionalFunding,
      reserveTarget:c.cashReserveTarget,endingReceivables:last.receivables,endingPayables:last.payables,
      endingVATCredit:last.vatCredit,endingVATPayable:last.vatPayable,endingTaxPayable:last.taxesPayable,
      totalInterest:sum(months,'interest'),totalPrincipal:sum(months,'principal'),
      totalNetProfit:sum(months,'netProfit'),initialTaxLoss:preopeningCost+initialExpense,
      projectProfit:sum(months,'netProfit')-preopeningCost-initialExpense,
      canMeetDemand:last.capacity>=last.demand,solvent:lowestCash>=0,
      minimumCashLabel:lowestMonth ? months[lowestMonth-1].label:'antes de abrir'
    };
    Object.keys(summary).forEach(function (key) { if (typeof summary[key] === 'number') summary[key]=money(summary[key]); });
    return {config:c,months:months,summary:summary,assumptions:assumptions.slice()};
  }

  return Object.freeze({defaults:defaults,defaultInvestments:defaultInvestments,simulate:simulate,validate:validate});
});
