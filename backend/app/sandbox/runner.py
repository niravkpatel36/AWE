# runner.py - executed inside sandbox container
import runpy, sys
# the container binds /work as the read-only code directory
sys.path.insert(0, "/work")
try:
    # execute script.py from /work
    with open("/work/script.py", "r") as f:
        code = f.read()
    exec(compile(code, "/work/script.py", "exec"), {"__name__": "__main__"})
except Exception as e:
    import traceback
    traceback.print_exc()
    sys.exit(1)
