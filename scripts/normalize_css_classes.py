import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXTS = ['.css', '.jsx', '.js', '.html']

def lc_first(s):
    return s[0].lower() + s[1:] if s else s

# 1) collect class names from CSS that start with uppercase
css_names = set()
for path in ROOT.rglob('*.css'):
    try:
        text = path.read_text(encoding='utf-8')
    except Exception:
        continue
    # Find CSS selectors starting with uppercase letter
    for m in re.finditer(r"\.([A-Z][A-Za-z0-9_-]*)", text):
        css_names.add(m.group(1))

# Also add some known patterns that might not have been found
known_patterns = [
    'App-compat-modal', 'App-compat-header', 'App-compat-title', 'App-compat-close', 
    'App-compat-body', 'CustomDropdown-arrow-svg', 'Login-form', 'Login-submit',
    'Checkin-btnPrimary', 'Checkin-btnSecondary'
]
for pattern in known_patterns:
    css_names.add(pattern)

if not css_names:
    print('No uppercase-starting CSS class selectors found. Nothing to do.')
    exit(0)

mapping = {name: lc_first(name) for name in sorted(css_names)}
print('Found {} CSS class names to normalize:'.format(len(mapping)))
for k,v in mapping.items():
    print(f'{k} -> {v}')

# 2) apply replacements across target files
files_changed = {}
for ext in EXTS:
    for path in ROOT.rglob(f'*{ext}'):
        # skip node_modules, .git, dist
        if any(part in ('node_modules', '.git', 'dist') for part in path.parts):
            continue
        try:
            text = path.read_text(encoding='utf-8')
        except Exception:
            continue
        original = text
        new_text = text
        
        for old, new in mapping.items():
            if ext == '.css':
                # replace CSS selectors like .Old-name
                pattern = re.compile(r"\." + re.escape(old) + r"(?![A-Za-z0-9_-])")
                new_text = pattern.sub('.' + new, new_text)
            else:
                # replace className="Old-name" and similar patterns
                # Match word boundaries more carefully
                patterns = [
                    # className="ClassName"
                    re.compile(r'className="' + re.escape(old) + r'"'),
                    # className='ClassName'  
                    re.compile(r"className='" + re.escape(old) + r"'"),
                    # className={`ClassName`}
                    re.compile(r'className=\{`' + re.escape(old) + r'`\}'),
                    # className={`${someVar} ClassName`}
                    re.compile(r'(\$\{[^}]*\}\s+)' + re.escape(old) + r'(?=`)'),
                    # className="some-class ClassName"
                    re.compile(r'(className="[^"]*\s)' + re.escape(old) + r'(?=")'),
                    # className='some-class ClassName'
                    re.compile(r"(className='[^']*\s)" + re.escape(old) + r"(?=')"),
                    # class="ClassName" (for HTML)
                    re.compile(r'class="' + re.escape(old) + r'"'),
                    # class='ClassName'
                    re.compile(r"class='" + re.escape(old) + r"'"),
                    # querySelector('.ClassName')
                    re.compile(r"querySelector\(['\"]\\." + re.escape(old) + r"['\"]"),
                    # Just the class name as a standalone word
                    re.compile(r'(?<![A-Za-z0-9_-])' + re.escape(old) + r'(?![A-Za-z0-9_-])')
                ]
                
                for pattern in patterns:
                    if pattern.groups > 0:
                        # Pattern has groups, replace with group + new name
                        new_text = pattern.sub(r'\1' + new, new_text)
                    else:
                        # Simple replacement
                        new_text = pattern.sub(lambda m: m.group(0).replace(old, new), new_text)

        if new_text != original:
            path.write_text(new_text, encoding='utf-8')
            files_changed[str(path.relative_to(ROOT))] = True

# Summary
if files_changed:
    print('\nFiles changed:')
    for f in sorted(files_changed):
        print(' -', f)
    print('\nDone.')
    exit(0)
else:
    print('No files were modified by the normalization (no matches in target files).')
    exit(0)
