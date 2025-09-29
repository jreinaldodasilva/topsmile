
import xml.etree.ElementTree as ET
import html

def generate_markdown_report(xml_file, output_file):
    try:
        tree = ET.parse(xml_file)
        root = tree.getroot()
    except ET.ParseError as e:
        print(f"Error parsing XML file: {e}")
        return

    failed_tests = []
    total_tests = 0
    test_suites = set()

    for testsuite in root.findall('testsuite'):
        suite_name = testsuite.get('name')
        total_tests += int(testsuite.get('tests', 0))
        
        has_failures = False
        for testcase in testsuite.findall('testcase'):
            failure = testcase.find('failure')
            if failure is not None:
                if not has_failures:
                    test_suites.add(suite_name)
                    has_failures = True

                test_name = testcase.get('name')
                classname = testcase.get('classname')
                error_message = failure.get('message', 'No message provided.')
                
                # The stack trace is the text content of the failure element
                stack_trace = failure.text.strip() if failure.text else 'No stack trace provided.'

                # Clean up the stack trace
                stack_trace = html.unescape(stack_trace)


                failed_tests.append({
                    'suite': suite_name,
                    'name': test_name,
                    'classname': classname,
                    'error_message': error_message,
                    'stack_trace': stack_trace
                })

    with open(output_file, 'w') as f:
        f.write("# Frontend Failed Tests\n\n")
        f.write(f"**Total failed tests:** {len(failed_tests)}\n")
        f.write(f"**Total tests executed:** {total_tests}\n")
        f.write(f"**Test suites affected:** {len(test_suites)}\n\n")

        # Group failed tests by suite
        suites = {}
        for test in failed_tests:
            if test['suite'] not in suites:
                suites[test['suite']] = []
            suites[test['suite']].append(test)

        for suite_name, tests in suites.items():
            f.write(f"## Test Suite: {suite_name}\n\n")
            for test in tests:
                f.write(f"### Test: {test['name']}\n\n")
                if test['classname']:
                    f.write(f"**File or class:** `{test['classname']}`\n\n")
                f.write(f"> {test['error_message']}\n\n")
                if test['stack_trace']:
                    f.write("```\n")
                    f.write(test['stack_trace'])
                    f.write("\n```\n\n")

if __name__ == "__main__":
    generate_markdown_report('/home/rebelde/Development/topsmile/reports/junit-frontend_secondpart.xml', '/home/rebelde/Development/topsmile/docs/tests/frontend_failedtests_secondpart.md')
