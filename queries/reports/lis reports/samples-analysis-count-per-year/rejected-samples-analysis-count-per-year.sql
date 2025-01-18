select distinct 'TEST'                                        as 'Mwezi',
                COALESCE(a.col1, 0)                                        AS 'JAN',
                COALESCE(a.col2, 0)                                        AS 'FEB',
                COALESCE(a.col3, 0)                                        AS 'MARCH',
                COALESCE(a.col4, 0)                                        AS 'APRIL',
                COALESCE(a.col5, 0)                                        AS 'MAY',
                COALESCE(a.col6, 0)                                        AS 'JUNE',
                COALESCE(a.col7, 0)                                        AS 'JULY',
                COALESCE(a.col8, 0)                                        AS 'AUG',
                COALESCE(a.col9, 0)                                        AS 'SEPT',
                COALESCE(a.col10, 0)                                        AS 'OCT',
                COALESCE(a.col11, 0)                                        AS 'NOV',
                COALESCE(a.col12, 0)                                        AS 'DEC',
                COALESCE((a.col1 + a.col2 + a.col3 + a.col4 + a.col5 + a.col6 + a.col7 + a.col8 + a.col9 + a.col10+ a.col11+ a.col12),
                         0)                                                AS 'Jumla_Kuu'
from (select  	SUM(IF(MONTH(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) = 1, 1, 0)) AS col1,
				SUM(IF(MONTH(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) = 2, 1, 0)) AS col2,
				SUM(IF(MONTH(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) = 3, 1, 0)) AS col3,
				SUM(IF(MONTH(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) = 4, 1, 0)) AS col4,
				SUM(IF(MONTH(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) = 5, 1, 0)) AS col5,
				SUM(IF(MONTH(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) = 6, 1, 0)) AS col6,
				SUM(IF(MONTH(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) = 7, 1, 0)) AS col7,
				SUM(IF(MONTH(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) = 8, 1, 0)) AS col8,
				SUM(IF(MONTH(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) = 9, 1, 0)) AS col9,
				SUM(IF(MONTH(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) = 10, 1, 0)) AS col10,
				SUM(IF(MONTH(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) = 11, 1, 0)) AS col11,
				SUM(IF(MONTH(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) = 12, 1, 0)) AS col12

      from visit v
        INNER JOIN person p ON p.person_id=v.patient_id
        INNER JOIN encounter test_order_encounter ON test_order_encounter.visit_id=v.visit_id
        INNER JOIN orders test_order_order ON test_order_order.encounter_id=test_order_encounter.encounter_id
        INNER JOIN concept test_order_concept ON test_order_concept.concept_id=test_order_order.concept_id AND (test_order_concept.concept_id=(select concept_id from concept where uuid =:uuid))
        INNER JOIN lb_sample_order so ON so.order_id = test_order_order.order_id
        INNER JOIN lb_sample sp ON sp.sample_id = so.sample_id AND so.sample_id IN(SELECT sample_id FROM lb_sample_status WHERE (category = 'REJECTED_LABORATORY' OR category ='REJECTED_REGISTRATION'))
        -- INNER JOIN lb_sample_status spstatus ON spstatus.sample_id = sp.sample_id AND (spstatus.category = 'REJECTED_LABORATORY' OR spstatus.category='REJECTED_REGISTRATION')
        WHERE CAST(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT') AS DATE) BETWEEN :startDate and :endDate
     ) as a