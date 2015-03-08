SELECT 
    _sites.name AS SiteName,
    _projects.name AS ProjectName,
    _workbooks.name AS WorkbookName,
    _views.name AS ViewName,
    _views.*
FROM 
    _sites
    INNER JOIN _projects ON _sites.id = _projects.site_id
    INNER JOIN _workbooks ON _projects.id = _workbooks.project_id
    INNER JOIN _views ON _workbooks.id = _views.workbook_id
WHERE
    _sites.name = 'POC' AND
    _projects.name NOT IN ('default', 'Tableau Samples');
    


SELECT * FROM _sites;
