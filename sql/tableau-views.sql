SELECT DISTINCT
    _sites.name AS SiteName,
    _projects.name AS ProjectName,
    --_workbooks.name AS WorkbookName,
    _views.name AS ViewName,
    _views.*
FROM 
    _sites
    INNER JOIN _projects ON _sites.id = _projects.site_id
    INNER JOIN _workbooks ON _projects.id = _workbooks.project_id
    INNER JOIN _views ON _workbooks.id = _views.workbook_id
WHERE
    _sites.name = 'POC' --AND
    --_projects.name NOT IN ('default', 'Tableau Samples')
ORDER BY ViewName


SELECT DISTINCT  _views.name AS ViewName
FROM 
    next_gen_permissions
    INNER JOIN _views ON next_gen_permissions.authorizable_id = _views.id
    INNER JOIN _groups ON next_gen_permissions.grantee_id = _groups.id
    INNER JOIN group_users ON _groups.id = group_users.group_id
    INNER JOIN _users ON group_users.user_id = _users.id
WHERE authorizable_type = 'View' AND
      grantee_type = 'Group' AND
      _users.name = 'poc_agusa'
ORDER BY 1



SELECT DISTINCT
    _sites.name AS SiteName,
    _projects.name AS ProjectName,
    _workbooks.name AS WorkbookName,
    _views.name AS ViewName,
    _views.view_url AS ViewURL
FROM 
    _sites
    INNER JOIN _projects ON _sites.id = _projects.site_id
    INNER JOIN _workbooks ON _projects.id = _workbooks.project_id
    INNER JOIN _views ON _workbooks.id = _views.workbook_id
    INNER JOIN next_gen_permissions perm ON _views.id = perm.authorizable_id
    INNER JOIN _groups ON perm.grantee_id = _groups.id
    INNER JOIN group_users ON _groups.id = group_users.group_id
    INNER JOIN _users ON group_users.user_id = _users.id
WHERE
    _sites.name = 'POC'
    AND _projects.name NOT IN ('default', 'Tableau Samples')
    AND perm.authorizable_type = 'View'
    AND perm.grantee_type = 'Group'
    AND _users.name = 'poc_agusa'
ORDER BY ViewName




