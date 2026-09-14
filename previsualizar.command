#!/bin/zsh
cd -- "$(dirname "$0")" || exit 1
python3 - <<'PY'
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import threading
import webbrowser

address = ('127.0.0.1', 8767)
try:
    server = ThreadingHTTPServer(address, SimpleHTTPRequestHandler)
except OSError:
    print('El puerto 8767 está ocupado. Cierra la previsualización anterior y vuelve a intentarlo.')
    raise SystemExit(1)
url = 'http://127.0.0.1:8767/index.html'
print('Atelier · versión local')
print(url)
print('Para terminar, pulsa Control+C o cierra esta ventana.')
threading.Timer(0.6, lambda: webbrowser.open(url)).start()
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.server_close()
PY
