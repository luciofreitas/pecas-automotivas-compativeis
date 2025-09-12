#!/usr/bin/env python3
"""Remove temporariamente a classe 'page-offset' de className em arquivos JS/JSX/TS/TSX.
Cria backups com sufixo .backup
"""
import os
import re
import glob
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent  # assume script em scripts/

# arquivos a processar
GLOBS = [
    "src/**/*.js",
    "src/**/*.jsx",
    "src/**/*.ts",
    "src/**/*.tsx",
]

# pular estes diretórios
SKIP_DIRS = ("node_modules", ".git", "dist", "build")

# regex para encontrar className = "..." or '...' or `...`
# use a quoting-safe character class to avoid parser issues
CLASS_PATTERN = re.compile(r'(className\s*=\s*)(["\'`])(.*?)\2', re.S)


def remove_page_offset_from_classvalue(value: str) -> str:
    """Remove token 'page-offset' mantendo o restante da string/template/interpolação."""
    # remove ocorrências isoladas de 'page-offset' e normaliza espaços
    new = re.sub(r'\bpage-offset\b', '', value)
    # colapsa múltiplos espaços
    new = re.sub(r'\s{2,}', ' ', new)
    # strip leading/trailing whitespace
    return new.strip()


def process_file(path: Path) -> bool:
    text = path.read_text(encoding='utf-8')
    changed = False

    def repl(m):
        nonlocal changed
        prefix, quote, inner = m.group(1), m.group(2), m.group(3)
        new_inner = remove_page_offset_from_classvalue(inner)
        # se vazio após remoção, mantém string vazia (atributo permanece)
        if new_inner == "":
            replacement = f"{prefix}{quote}{''}{quote}"
        else:
            replacement = f"{prefix}{quote}{new_inner}{quote}"
        if replacement != m.group(0):
            changed = True
            return replacement
        return m.group(0)

    new_text = CLASS_PATTERN.sub(repl, text)

    if changed:
        backup = path.with_suffix(path.suffix + '.backup')
        backup.write_text(text, encoding='utf-8')
        path.write_text(new_text, encoding='utf-8')
        print(f"✓ atualizado: {path} (backup -> {backup.name})")
        return True

    print(f"- sem alteração: {path}")
    return False


def should_skip(path_str: str) -> bool:
    return any(part in path_str for part in SKIP_DIRS)


def main():
    os.chdir(ROOT)
    processed = []
    for pattern in GLOBS:
        for fname in glob.glob(pattern, recursive=True):
            if should_skip(fname):
                continue
            p = Path(fname)
            if p.is_file():
                try:
                    if process_file(p):
                        processed.append(str(p))
                except Exception as e:
                    print(f"✗ erro ao processar {p}: {e}")

    print()
    print(f"Arquivos modificados: {len(processed)}")
    for f in processed:
        print(" -", f)
    print("\nObservação: o script altera apenas atributos className que usam literais (\"'`).")
    print("Para casos dinâmicos (expressões, classnames helper) remova manualmente se necessário.")


if __name__ == "__main__":
    main()
