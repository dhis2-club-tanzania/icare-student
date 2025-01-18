select distinct 'STAFF'                                        as 'AINA YA MGONJWA',
                COALESCE(a.col1, 0)                                        AS 'ME',
                COALESCE(a.col2, 0)                                        AS 'KE',
                COALESCE((a.col1 + a.col2), 0)                             AS 'TOTAL'
from (select  SUM(CASE WHEN p.gender = 'M' THEN  1 ELSE 0 END) AS col1,
             SUM(CASE WHEN p.gender = 'F' THEN  1 ELSE 0 END) AS col2

      from visit v
        INNER JOIN person p ON p.person_id=v.patient_id
        INNER JOIN person_attribute pa ON pa.person_id = v.patient_id AND pa.value = 'Staff'
        WHERE CAST(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT') AS DATE) BETWEEN :startDate and :endDate
     ) as a
 UNION ALL
 select distinct 'STUDENT'                                        as 'AINA YA MGONJWA',
                COALESCE(b.col1, 0)                                        AS 'ME',
                COALESCE(b.col2, 0)                                        AS 'KE',
                COALESCE((b.col1 + b.col2), 0)                             AS 'TOTAL'
from (select  SUM(CASE WHEN p.gender = 'M' THEN  1 ELSE 0 END) AS col1,
             SUM(CASE WHEN p.gender = 'F' THEN  1 ELSE 0 END) AS col2

      from visit v
        INNER JOIN person p ON p.person_id=v.patient_id
        INNER JOIN person_attribute pa ON pa.person_id = v.patient_id AND pa.value = 'Student'
        WHERE CAST(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT') AS DATE) BETWEEN :startDate and :endDate
     ) as b
 UNION ALL
 select distinct 'OTHER'                                        as 'AINA YA MGONJWA',
                COALESCE(c.col1, 0)                                        AS 'ME',
                COALESCE(c.col2, 0)                                        AS 'KE',
                COALESCE((c.col1 + c.col2), 0)                             AS 'TOTAL'
from (select  SUM(CASE WHEN p.gender = 'M' THEN  1 ELSE 0 END) AS col1,
             SUM(CASE WHEN p.gender = 'F' THEN  1 ELSE 0 END) AS col2

      from visit v
        INNER JOIN person p ON p.person_id=v.patient_id AND v.patient_id NOT IN(SELECT  pa2.person_id FROM person_attribute pa2 WHERE pa2.person_attribute_type_id = 68 AND (pa2.value = 'Staff' OR pa2.value = 'Student'))
        WHERE CAST(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT') AS DATE) BETWEEN :startDate and :endDate
     ) as c