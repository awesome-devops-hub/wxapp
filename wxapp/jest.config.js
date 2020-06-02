module.exports = {
    "reporters": [
        "default",
        [
            "./node_modules/jest-html-reporter", 
            {
                "pageTitle": "Test Report",
                "outputPath": "./src/functional_test/test_reports/index.html",
                "includeFailureMsg": true
            }
        ]
    ]
};