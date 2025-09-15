git ls-files '*.tsx' | sed 's|^|https://raw.githubusercontent.com/jreinaldodasilva/topsmile/main/|' >> frontend_raw_links.txt

npx https://github.com/google-gemini/gemini-cli

