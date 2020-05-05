# Hand-In-Hand's COVID-19 Benefits Tool

Domestic workers do the work that makes all other work possible. It's crucial to recognize the work of nannies, house cleaners and home attendants who are on the frontlines of our response to COVID-19.

This tool makes it easier for employers to discover what benefits their employees are entitled to, and provides links to find out more or apply.

**NB:** This tool is currently a DRAFT.

## Response Data

The response data needs to be set by our local policy expert, who prefers to work in Google Docs. The perl scripts in `misc` are used to generate scenarios for her to fill in, and to bring her text into the tool.

Primary document, from which the relevant spreadsheets are linked: https://docs.google.com/document/d/1e16JsNy9JtfwBhOvyvz56yKmx5zMxedTLytsECd7Rjk/edit?usp=sharing

### Generating scenarios

`matrix.pl` can be used to tinker with which questions matter for which benefits, count how many scenarios will be created, and, once the questions are set, write out a CSV that can be brought into Google Sheets.

Unfortunately, Sheets doesn't play nice with newlines, so each benefit scenario spreadsheet needs to be adjusted on import:

1. Create the import csv from `matrix.pl`
2. Import it into the Sheets doc as a new sheet
3. Change the tab to the name of the benefit
4. In the formula box for cell C1, enter: `=SUBSTITUTE(A1, "XXX", char(10))`
5. Copy column C and paste it **values only** into column D
6. Delete columns A and C
7. Insert a line at the top and label the columns "Code" (A) "Scenario" (B) and "Response" (C)
8. Insert a line at the top and label it with the name of the benefit
9. Change the font size of the title to 14 and bold both that and the headers
10. Adjust column widths so that A is mostly hidden, B shows all the scenarios and there's enough room to write comfortably in C
11. Set vertical alignment to top for the whole sheet
12. Turn on text wrapping for column C

Since we only want to share one worksheet, create a new tab for each benefit.

### Importing responses

Start by exporting the benefit tab to csv. Name it `{benefit_abbreviation}.csv` and place it in `misc/data`.

Run `import_benefits.pl` by passing the benefit abbreviation as the only argument. If it worked, it'll print "Done!" and exit.

*NB: You might need to install the CPAN modules `JSON` and `Text::CSV`.*

Finally, check out the newly-written file at `data/{benefit_abbreviation}.csv` to be sure it's correct, test, and commit.

