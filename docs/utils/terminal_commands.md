git ls-files | grep '\.\(tsx\|ts\|js\|json\)$' | grep -E '^(src/|public/|[^/]+\.(tsx|ts|js|json)$)' | sed 's|^|https://raw.githubusercontent.com/jreinaldodasilva/topsmile/main/|' > docs/githublinks/frontend_raw_links.txt

git ls-files | grep '\.\(tsx\|ts\|js\|json\)$' | grep '^backend/' | sed 's|^|https://raw.githubusercontent.com/jreinaldodasilva/topsmile/main/|' > docs/githublinks/backend_raw_links.txt

git ls-files | grep '\.\(tsx\|ts\|js\|json\|map\)$' | grep '^packages/' | sed 's|^|https://raw.githubusercontent.com/jreinaldodasilva/topsmile/main/|' > docs/githublinks/types_raw_links.txt




git ls-files '*.tsx' | sed 's|^|https://raw.githubusercontent.com/jreinaldodasilva/topsmile/main/|' >> tsx_raw_links.txt

git ls-files '*.ts' | sed 's|^|https://raw.githubusercontent.com/jreinaldodasilva/topsmile/main/|' > ts_raw_links.txt

npx https://github.com/google-gemini/gemini-cli

