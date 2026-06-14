SELECT 'Category' as tbl, count(*) FROM "Category"
UNION ALL
SELECT 'Submission', count(*) FROM "Submission"
UNION ALL
SELECT 'PageView', count(*) FROM "PageView"
UNION ALL
SELECT 'SearchQuery', count(*) FROM "SearchQuery";
