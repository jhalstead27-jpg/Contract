"""Decrypt a TransactionDesk ASIS-7x export so the browser can write onto it.

Usage: python3 scripts/prepare_template.py <downloaded.pdf> [assets/asis-7x.pdf]
TransactionDesk PDFs open with an empty password but carry edit restrictions,
which pdf-lib cannot load. This rewrites the same pages without encryption.
"""
import sys
import pypdf

src = sys.argv[1]
dst = sys.argv[2] if len(sys.argv) > 2 else "assets/asis-7x.pdf"
reader = pypdf.PdfReader(src)
if reader.is_encrypted:
    reader.decrypt("")
writer = pypdf.PdfWriter(clone_from=reader)
with open(dst, "wb") as f:
    writer.write(f)
print(f"wrote {dst} ({len(reader.pages)} pages)")
