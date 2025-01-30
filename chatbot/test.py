import sys

if len(sys.argv) > 1:
    param = sys.argv[1]
    print(f"{param}")
else:
    print("Aucun paramètre reçu")