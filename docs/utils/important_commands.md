git ls-files '*.tsx' | sed 's|^|https://raw.githubusercontent.com/jreinaldodasilva/topsmile/main/|' >> tsx_raw_links.txt

git ls-files | grep '\.\(tsx\|ts\|js\|json\)$' | grep -E '^(src/|public/|[^/]+\.(tsx|ts|js|json)$)' | sed 's|^|https://raw.githubusercontent.com/jreinaldodasilva/topsmile/main/|' >> docs/frontend/frontend_raw_links.txt

git ls-files | grep '\.\(tsx\|ts\|js\|json\)$' | grep '^backend/' | sed 's|^|https://raw.githubusercontent.com/jreinaldodasilva/topsmile/main/|' >> docs/backend/backend_raw_links.txt

npx https://github.com/google-gemini/gemini-cli

