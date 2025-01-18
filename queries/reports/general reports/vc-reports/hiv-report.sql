select distinct 'Julai'                                        as 'Mwezi',
                COALESCE(a.col1, 0)                                        AS 'ME_Umri_Chini_Ya_Mwaka_1',
                COALESCE(a.col2, 0)                                        AS 'KE_Umri_Chini_Ya_Mwaka_1',
                COALESCE((a.col1 + a.col2), 0)                             AS 'Jumla_Ya_Chini_Ya_Mwaka_1',
                COALESCE(a.col3, 0)                                        AS 'ME_Umri_Mwaka_1_Hadi_4',
                COALESCE(a.col4, 0)                                        AS 'KE__Umri_Mwaka_1_Hadi_4',
                COALESCE((a.col3 + a.col4), 0)                             AS 'Jumla_Umri_Mwaka_1_Hadi_4',
                COALESCE(a.col5, 0)                                        AS 'ME_Umri_Mwaka_5_Hadi_9',
                COALESCE(a.col6, 0)                                        AS 'KE_Umri_Mwaka_5_Hadi_9',
                coalesce((a.col5 + a.col6), 0)                             AS 'Jumla_Umri_Mwaka_5_Hadi_9',
                COALESCE(a.col7, 0)                                        AS 'ME_Umri_Mwaka_10_Hadi_14',
                COALESCE(a.col8, 0)                                        AS 'KE_Umri_Mwaka_10_Hadi_14',
                COALESCE((a.col7 + a.col8), 0)                             AS 'Jumla_Umri_Mwaka_10_Hadi_14',
                COALESCE(a.col9, 0)                                        AS 'ME_Umri_Mwaka_15_Hadi_19',
                COALESCE(a.col10, 0)                                        AS 'KE_Umri_Mwaka_15_Hadi_19',
                COALESCE((a.col9 + a.col10), 0)                             AS 'Jumla_Umri_Mwaka_15_Hadi_19',
                COALESCE(a.col11, 0)                                        AS 'ME_Umri_Mwaka_20_Hadi_24',
                COALESCE(a.col12, 0)                                        AS 'KE_Umri_Mwaka_20_Hadi_24',
                COALESCE((a.col11 + a.col12), 0)                             AS 'Jumla_Umri_Mwaka_20_Hadi_24',
                COALESCE(a.col13, 0)                                        AS 'ME_Umri_Mwaka_25_Hadi_49',
                COALESCE(a.col14, 0)                                        AS 'KE_Umri_Mwaka_25_Hadi_49',
                COALESCE((a.col13 + a.col14), 0)                             AS 'Jumla_Umri_Mwaka_25_Hadi_49',
                COALESCE(a.col15, 0)                                        AS 'ME_Umri_Miaka_Juu_Ya_50',
                COALESCE(a.col16, 0)                                       AS 'KE_Umri_Miaka_Juu_Ya_50',
                COALESCE((a.col15 + a.col16), 0)                            AS 'Jumla_Umri_Miaka_Juu_Ya_50',
                COALESCE((a.col1 + a.col3 + a.col5 + a.col7 + a.col9 + a.col11+ a.col13+ a.col15), 0)  AS 'ME_Jumla_Kuu',
                COALESCE((a.col2 + a.col4 + a.col6 + a.col8 + a.col10+ a.col12+ a.col14+ a.col16), 0) AS 'KE_Jumla_Kuu',
                COALESCE((a.col1 + a.col2 + a.col3 + a.col4 + a.col5 + a.col6 + a.col7 + a.col8 + a.col9 + a.col10+ a.col11+ a.col12+ a.col13+ a.col14+ a.col15+ a.col16),
                         0)                                                AS 'Jumla_Kuu'
from (select  SUM(CASE WHEN TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) < 1
                        AND p.gender = 'M' THEN  1 ELSE 0 END) AS col1,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) < 1
                        AND p.gender = 'F', 1, 0)) AS col2,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 1 AND 4
                        AND p.gender = 'M', 1, 0)) AS col3,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 1 AND 4
                        AND p.gender = 'F', 1, 0)) AS col4,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 5 AND 9
                        AND p.gender = 'M', 1, 0)) AS col5,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 5 AND 9
                        AND p.gender = 'F', 1, 0)) AS col6,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 10 AND 14
                        AND p.gender = 'M', 1, 0)) AS col7,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 10 AND 14
                        AND p.gender = 'F', 1, 0)) AS col8,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 15 AND 19
                        AND p.gender = 'M', 1, 0)) AS col9,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 15 AND 19
                        AND p.gender = 'F', 1, 0)) AS col10,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 20 AND 24
                        AND p.gender = 'M', 1, 0)) AS col11,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 20 AND 24
                        AND p.gender = 'F', 1, 0)) AS col12,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 25 AND 49
                        AND p.gender = 'M', 1, 0)) AS col13,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 25 AND 49
                        AND p.gender = 'F', 1, 0)) AS col14,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) > 50
                        AND p.gender = 'M', 1, 0)) AS col15,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) > 50
                        AND p.gender = 'F', 1, 0)) AS col16

      from visit v
        INNER JOIN person p ON p.person_id=v.patient_id
        INNER JOIN encounter test_order_encounter ON test_order_encounter.visit_id=v.visit_id
        INNER JOIN orders test_order_order ON test_order_order.encounter_id=test_order_encounter.encounter_id
        INNER JOIN concept test_order_concept ON test_order_concept.concept_id=test_order_order.concept_id AND (test_order_concept.concept_id=165912 OR test_order_concept.concept_id=165866)
        WHERE CAST(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT') AS DATE) BETWEEN '2022-12-01' and '2022-12-31'
     ) as a

UNION ALL

select distinct 'Agosti'                                                   AS 'Mwezi',
                COALESCE(e.col1, 0)                                        AS 'ME_Umri_Chini_Ya_Mwaka_1',
                COALESCE(e.col2, 0)                                        AS 'KE_Umri_Chini_Ya_Mwaka_1',
                COALESCE((e.col1 + e.col2), 0)                             AS 'Jumla_Ya_Chini_Ya_Mwaka_1',
                COALESCE(e.col3, 0)                                        AS 'ME_Umri_Mwaka_1_Hadi_4',
                COALESCE(e.col4, 0)                                        AS 'KE__Umri_Mwaka_1_Hadi_4',
                coalesce((e.col3 + e.col4), 0)                             AS 'Jumla_Umri_Mwaka_1_Hadi_4',
                COALESCE(e.col5, 0)                                        AS 'ME_Umri_Mwaka_5_Hadi_9',
                COALESCE(e.col6, 0)                                        AS 'KE_Umri_Mwaka_5_Hadi_9',
                coalesce((e.col5 + e.col6), 0)                             AS 'Jumla_Umri_Mwaka_5_Hadi_9',
                COALESCE(e.col7, 0)                                        AS 'ME_Umri_Mwaka_10_Hadi_14',
                COALESCE(e.col8, 0)                                        AS 'KE_Umri_Mwaka_10_Hadi_14',
                coalesce((e.col7 + e.col8), 0)                             AS 'Jumla_Umri_Mwaka_10_Hadi_14',
                COALESCE(e.col9, 0)                                        AS 'ME_Umri_Mwaka_15_Hadi_19',
                COALESCE(e.col10, 0)                                        AS 'KE_Umri_Mwaka_15_Hadi_19',
                coalesce((e.col9 + e.col10), 0)                             AS 'Jumla_Umri_Mwaka_15_Hadi_19',
                COALESCE(e.col11, 0)                                        AS 'ME_Umri_Mwaka_20_Hadi_24',
                COALESCE(e.col12, 0)                                        AS 'KE_Umri_Mwaka_20_Hadi_24',
                coalesce((e.col11 + e.col12), 0)                             AS 'Jumla_Umri_Mwaka_20_Hadi_24',
                COALESCE(e.col13, 0)                                        AS 'ME_Umri_Mwaka_25_Hadi_49',
                COALESCE(e.col14, 0)                                        AS 'KE_Umri_Mwaka_25_Hadi_49',
                coalesce((e.col13 + e.col14), 0)                             AS 'Jumla_Umri_Mwaka_25_Hadi_49',
                COALESCE(e.col15, 0)                                        AS 'ME_Umri_Miaka_Juu_Ya_50',
                COALESCE(e.col16, 0)                                       AS 'KE_Umri_Miaka_Juu_Ya_50',
                COALESCE((e.col15 + e.col16), 0)                            AS 'Jumla_Umri_Miaka_Juu_Ya_50',
                COALESCE((e.col1 + e.col3 + e.col5 + e.col7 + e.col9 + e.col11 + e.col13 + e.col15), 0)  AS 'ME_Jumla_Kuu',
                COALESCE((e.col2 + e.col4 + e.col6 + e.col8 + e.col10 + e.col12 + e.col14 + e.col16), 0) AS 'KE_Jumla_Kuu',
                COALESCE((e.col1 + e.col2 + e.col3 + e.col4 + e.col5 + e.col6 + e.col7 + e.col8 + e.col9 + e.col10 + e.col11 + e.col12 + e.col13 + e.col14 + e.col15 + e.col16),
                         0)                                                AS 'Jumla_Kuu'
from (select SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) < 1
                        AND p.gender = 'M', 1, 0)) AS col1,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) < 1
                        AND p.gender = 'F', 1, 0)) AS col2,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 1 AND 4
                        AND p.gender = 'M', 1, 0)) AS col3,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 1 AND 4
                        AND p.gender = 'F', 1, 0)) AS col4,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 5 AND 9
                        AND p.gender = 'M', 1, 0)) AS col5,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 5 AND 9
                        AND p.gender = 'F', 1, 0)) AS col6,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 10 AND 14
                        AND p.gender = 'M', 1, 0)) AS col7,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 10 AND 14
                        AND p.gender = 'F', 1, 0)) AS col8,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 15 AND 19
                        AND p.gender = 'M', 1, 0)) AS col9,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 15 AND 19
                        AND p.gender = 'F', 1, 0)) AS col10,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 20 AND 24
                        AND p.gender = 'M', 1, 0)) AS col11,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 20 AND 24
                        AND p.gender = 'F', 1, 0)) AS col12,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 25 AND 49
                        AND p.gender = 'M', 1, 0)) AS col13,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 25 AND 49
                        AND p.gender = 'F', 1, 0)) AS col14,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) > 50
                        AND p.gender = 'M', 1, 0)) AS col15,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) > 50
                        AND p.gender = 'F', 1, 0)) AS col16

      from visit v
        LEFT JOIN person p ON p.person_id=v.patient_id
        LEFT JOIN encounter test_order_encounter ON test_order_encounter.visit_id=v.visit_id
        LEFT JOIN orders test_order_order ON test_order_order.encounter_id=test_order_encounter.encounter_id
        INNER JOIN concept test_order_concept ON test_order_concept.concept_id=test_order_order.concept_id AND test_order_concept.concept_id=165912 OR test_order_concept.concept_id=165866
        WHERE CAST(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT') AS DATE) BETWEEN '2022-12-01' and '2022-12-31'
     ) as e

UNION ALL

select distinct 'Septemba'                                                   AS 'Mwezi',
                COALESCE(f.col1, 0)                                        AS 'ME_Umri_Chini_Ya_Mwaka_1',
                COALESCE(f.col2, 0)                                        AS 'KE_Umri_Chini_Ya_Mwaka_1',
                COALESCE((f.col1 + f.col2), 0)                             AS 'Jumla_Ya_Chini_Ya_Mwaka_1',
                COALESCE(f.col3, 0)                                        AS 'ME_Umri_Mwaka_1_Hadi_4',
                COALESCE(f.col4, 0)                                        AS 'KE__Umri_Mwaka_1_Hadi_4',
                coalesce((f.col3 + f.col4), 0)                             AS 'Jumla_Umri_Mwaka_1_Hadi_4',
                COALESCE(f.col5, 0)                                        AS 'ME_Umri_Mwaka_5_Hadi_9',
                COALESCE(f.col6, 0)                                        AS 'KE_Umri_Mwaka_5_Hadi_9',
                coalesce((f.col5 + f.col6), 0)                             AS 'Jumla_Umri_Mwaka_5_Hadi_9',
                COALESCE(f.col7, 0)                                        AS 'ME_Umri_Mwaka_10_Hadi_14',
                COALESCE(f.col8, 0)                                        AS 'KE_Umri_Mwaka_10_Hadi_14',
                coalesce((f.col7 + f.col8), 0)                             AS 'Jumla_Umri_Mwaka_10_Hadi_14',
                COALESCE(f.col9, 0)                                        AS 'ME_Umri_Mwaka_15_Hadi_19',
                COALESCE(f.col10, 0)                                        AS 'KE_Umri_Mwaka_15_Hadi_19',
                coalesce((f.col9 + f.col10), 0)                             AS 'Jumla_Umri_Mwaka_15_Hadi_19',
                COALESCE(f.col11, 0)                                        AS 'ME_Umri_Mwaka_20_Hadi_24',
                COALESCE(f.col12, 0)                                        AS 'KE_Umri_Mwaka_20_Hadi_24',
                coalesce((f.col11 + f.col12), 0)                             AS 'Jumla_Umri_Mwaka_20_Hadi_24',
                COALESCE(f.col13, 0)                                        AS 'ME_Umri_Mwaka_25_Hadi_49',
                COALESCE(f.col14, 0)                                        AS 'KE_Umri_Mwaka_25_Hadi_49',
                coalesce((f.col13 + f.col14), 0)                             AS 'Jumla_Umri_Mwaka_25_Hadi_49',
                COALESCE(f.col15, 0)                                        AS 'ME_Umri_Miaka_Juu_Ya_50',
                COALESCE(f.col16, 0)                                       AS 'KE_Umri_Miaka_Juu_Ya_50',
                COALESCE((f.col15 + f.col16), 0)                            AS 'Jumla_Umri_Miaka_Juu_Ya_50',
                COALESCE((f.col1 + f.col3 + f.col5 + f.col7 + f.col9 + f.col11 + f.col13 + f.col15), 0)  AS 'ME_Jumla_Kuu',
                COALESCE((f.col2 + f.col4 + f.col6 + f.col8 + f.col10 + f.col12 + f.col14 + f.col16), 0) AS 'KE_Jumla_Kuu',
                COALESCE((f.col1 + f.col2 + f.col3 + f.col4 + f.col5 + f.col6 + f.col7 + f.col8 + f.col9 + f.col10 + f.col11 + f.col12 + f.col13 + f.col14 + f.col15 + f.col16),
                         0)                                                AS 'Jumla_Kuu'
from (select SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) < 1
                        AND p.gender = 'M', 1, 0)) AS col1,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) < 1
                        AND p.gender = 'F', 1, 0)) AS col2,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 1 AND 4
                        AND p.gender = 'M', 1, 0)) AS col3,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 1 AND 4
                        AND p.gender = 'F', 1, 0)) AS col4,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 5 AND 9
                        AND p.gender = 'M', 1, 0)) AS col5,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 5 AND 9
                        AND p.gender = 'F', 1, 0)) AS col6,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 10 AND 14
                        AND p.gender = 'M', 1, 0)) AS col7,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 10 AND 14
                        AND p.gender = 'F', 1, 0)) AS col8,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 15 AND 19
                        AND p.gender = 'M', 1, 0)) AS col9,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 15 AND 19
                        AND p.gender = 'F', 1, 0)) AS col10,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 20 AND 24
                        AND p.gender = 'M', 1, 0)) AS col11,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 20 AND 24
                        AND p.gender = 'F', 1, 0)) AS col12,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 25 AND 49
                        AND p.gender = 'M', 1, 0)) AS col13,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 25 AND 49
                        AND p.gender = 'F', 1, 0)) AS col14,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) > 50
                        AND p.gender = 'M', 1, 0)) AS col15,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) > 50
                        AND p.gender = 'F', 1, 0)) AS col16

      from visit v
        LEFT JOIN person p ON p.person_id=v.patient_id
        LEFT JOIN encounter test_order_encounter ON test_order_encounter.visit_id=v.visit_id
        LEFT JOIN orders test_order_order ON test_order_order.encounter_id=test_order_encounter.encounter_id
        INNER JOIN concept test_order_concept ON test_order_concept.concept_id=test_order_order.concept_id AND test_order_concept.concept_id=165912 OR test_order_concept.concept_id=165866
        WHERE CAST(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT') AS DATE) BETWEEN '2022-12-01' and '2022-12-31'
     ) as f

UNION ALL

select distinct 'Jumla'                                                   AS 'Mwezi',
                COALESCE(g.col1, 0)                                        AS 'ME_Umri_Chini_Ya_Mwaka_1',
                COALESCE(g.col2, 0)                                        AS 'KE_Umri_Chini_Ya_Mwaka_1',
                COALESCE((g.col1 + g.col2), 0)                             AS 'Jumla_Ya_Chini_Ya_Mwaka_1',
                COALESCE(g.col3, 0)                                        AS 'ME_Umri_Mwaka_1_Hadi_4',
                COALESCE(g.col4, 0)                                        AS 'KE__Umri_Mwaka_1_Hadi_4',
                coalesce((g.col3 + g.col4), 0)                             AS 'Jumla_Umri_Mwaka_1_Hadi_4',
                COALESCE(g.col5, 0)                                        AS 'ME_Umri_Mwaka_5_Hadi_9',
                COALESCE(g.col6, 0)                                        AS 'KE_Umri_Mwaka_5_Hadi_9',
                coalesce((g.col5 + g.col6), 0)                             AS 'Jumla_Umri_Mwaka_5_Hadi_9',
                COALESCE(g.col7, 0)                                        AS 'ME_Umri_Mwaka_10_Hadi_14',
                COALESCE(g.col8, 0)                                        AS 'KE_Umri_Mwaka_10_Hadi_14',
                coalesce((g.col7 + g.col8), 0)                             AS 'Jumla_Umri_Mwaka_10_Hadi_14',
                COALESCE(g.col9, 0)                                        AS 'ME_Umri_Mwaka_15_Hadi_19',
                COALESCE(g.col10, 0)                                        AS 'KE_Umri_Mwaka_15_Hadi_19',
                coalesce((g.col9 + g.col10), 0)                             AS 'Jumla_Umri_Mwaka_15_Hadi_19',
                COALESCE(g.col11, 0)                                        AS 'ME_Umri_Mwaka_20_Hadi_24',
                COALESCE(g.col12, 0)                                        AS 'KE_Umri_Mwaka_20_Hadi_24',
                coalesce((g.col11 + g.col12), 0)                             AS 'Jumla_Umri_Mwaka_20_Hadi_24',
                COALESCE(g.col13, 0)                                        AS 'ME_Umri_Mwaka_25_Hadi_49',
                COALESCE(g.col14, 0)                                        AS 'KE_Umri_Mwaka_25_Hadi_49',
                coalesce((g.col13 + g.col14), 0)                             AS 'Jumla_Umri_Mwaka_25_Hadi_49',
                COALESCE(g.col15, 0)                                        AS 'ME_Umri_Miaka_Juu_Ya_50',
                COALESCE(g.col16, 0)                                       AS 'KE_Umri_Miaka_Juu_Ya_50',
                COALESCE((g.col15 + g.col16), 0)                            AS 'Jumla_Umri_Miaka_Juu_Ya_50',
                COALESCE((g.col1 + g.col3 + g.col5 + g.col7 + g.col9 + g.col11 + g.col13 + g.col15), 0)  AS 'ME_Jumla_Kuu',
                COALESCE((g.col2 + g.col4 + g.col6 + g.col8 + g.col10 + g.col12 + g.col14 + g.col16), 0) AS 'KE_Jumla_Kuu',
                COALESCE((g.col1 + g.col2 + g.col3 + g.col4 + g.col5 + g.col6 + g.col7 + g.col8 + g.col9 + g.col10 + g.col11 + g.col12 + g.col13 + g.col14 + g.col15 + g.col16),
                         0)                                                AS 'Jumla_Kuu'
from (select SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) < 1
                        AND p.gender = 'M', 1, 0)) AS col1,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) < 1
                        AND p.gender = 'F', 1, 0)) AS col2,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 1 AND 4
                        AND p.gender = 'M', 1, 0)) AS col3,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 1 AND 4
                        AND p.gender = 'F', 1, 0)) AS col4,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 5 AND 9
                        AND p.gender = 'M', 1, 0)) AS col5,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 5 AND 9
                        AND p.gender = 'F', 1, 0)) AS col6,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 10 AND 14
                        AND p.gender = 'M', 1, 0)) AS col7,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 10 AND 14
                        AND p.gender = 'F', 1, 0)) AS col8,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 15 AND 19
                        AND p.gender = 'M', 1, 0)) AS col9,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 15 AND 19
                        AND p.gender = 'F', 1, 0)) AS col10,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 20 AND 24
                        AND p.gender = 'M', 1, 0)) AS col11,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 20 AND 24
                        AND p.gender = 'F', 1, 0)) AS col12,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 25 AND 49
                        AND p.gender = 'M', 1, 0)) AS col13,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 25 AND 49
                        AND p.gender = 'F', 1, 0)) AS col14,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) > 50
                        AND p.gender = 'M', 1, 0)) AS col15,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) > 50
                        AND p.gender = 'F', 1, 0)) AS col16

      from visit v
        LEFT JOIN person p ON p.person_id=v.patient_id
        LEFT JOIN encounter test_order_encounter ON test_order_encounter.visit_id=v.visit_id
        LEFT JOIN orders test_order_order ON test_order_order.encounter_id=test_order_encounter.encounter_id
        INNER JOIN concept test_order_concept ON test_order_concept.concept_id=test_order_order.concept_id AND test_order_concept.concept_id=165912 OR test_order_concept.concept_id=165866
        WHERE CAST(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT') AS DATE) BETWEEN '2022-12-01' and '2022-12-31'
     ) as g

UNION ALL

select distinct 'VVU+'                                                   AS 'Mwezi',
                COALESCE(h.col1, 0)                                        AS 'ME_Umri_Chini_Ya_Mwaka_1',
                COALESCE(h.col2, 0)                                        AS 'KE_Umri_Chini_Ya_Mwaka_1',
                COALESCE((h.col1 + h.col2), 0)                             AS 'Jumla_Ya_Chini_Ya_Mwaka_1',
                COALESCE(h.col3, 0)                                        AS 'ME_Umri_Mwaka_1_Hadi_4',
                COALESCE(h.col4, 0)                                        AS 'KE__Umri_Mwaka_1_Hadi_4',
                coalesce((h.col3 + h.col4), 0)                             AS 'Jumla_Umri_Mwaka_1_Hadi_4',
                COALESCE(h.col5, 0)                                        AS 'ME_Umri_Mwaka_5_Hadi_9',
                COALESCE(h.col6, 0)                                        AS 'KE_Umri_Mwaka_5_Hadi_9',
                coalesce((h.col5 + h.col6), 0)                             AS 'Jumla_Umri_Mwaka_5_Hadi_9',
                COALESCE(h.col7, 0)                                        AS 'ME_Umri_Mwaka_10_Hadi_14',
                COALESCE(h.col8, 0)                                        AS 'KE_Umri_Mwaka_10_Hadi_14',
                coalesce((h.col7 + h.col8), 0)                             AS 'Jumla_Umri_Mwaka_10_Hadi_14',
                COALESCE(h.col9, 0)                                        AS 'ME_Umri_Mwaka_15_Hadi_19',
                COALESCE(h.col10, 0)                                        AS 'KE_Umri_Mwaka_15_Hadi_19',
                coalesce((h.col9 + h.col10), 0)                             AS 'Jumla_Umri_Mwaka_15_Hadi_19',
                COALESCE(h.col11, 0)                                        AS 'ME_Umri_Mwaka_20_Hadi_24',
                COALESCE(h.col12, 0)                                        AS 'KE_Umri_Mwaka_20_Hadi_24',
                coalesce((h.col11 + h.col12), 0)                             AS 'Jumla_Umri_Mwaka_20_Hadi_24',
                COALESCE(h.col13, 0)                                        AS 'ME_Umri_Mwaka_25_Hadi_49',
                COALESCE(h.col14, 0)                                        AS 'KE_Umri_Mwaka_25_Hadi_49',
                coalesce((h.col13 + h.col14), 0)                             AS 'Jumla_Umri_Mwaka_25_Hadi_49',
                COALESCE(h.col15, 0)                                        AS 'ME_Umri_Miaka_Juu_Ya_50',
                COALESCE(h.col16, 0)                                       AS 'KE_Umri_Miaka_Juu_Ya_50',
                COALESCE((h.col15 + h.col16), 0)                            AS 'Jumla_Umri_Miaka_Juu_Ya_50',
                COALESCE((h.col1 + h.col3 + h.col5 + h.col7 + h.col9 + h.col11 + h.col13 + h.col15), 0)  AS 'ME_Jumla_Kuu',
                COALESCE((h.col2 + h.col4 + h.col6 + h.col8 + h.col10 + h.col12 + h.col14 + h.col16), 0) AS 'KE_Jumla_Kuu',
                COALESCE((h.col1 + h.col2 + h.col3 + h.col4 + h.col5 + h.col6 + h.col7 + h.col8 + h.col9 + h.col10 + h.col11 + h.col12 + h.col13 + h.col14 + h.col15 + h.col16),
                         0)                                                AS 'Jumla_Kuu'
from (select SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) < 1
                        AND p.gender = 'M', 1, 0)) AS col1,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) < 1
                        AND p.gender = 'F', 1, 0)) AS col2,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 1 AND 4
                        AND p.gender = 'M', 1, 0)) AS col3,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 1 AND 4
                        AND p.gender = 'F', 1, 0)) AS col4,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 5 AND 9
                        AND p.gender = 'M', 1, 0)) AS col5,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 5 AND 9
                        AND p.gender = 'F', 1, 0)) AS col6,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 10 AND 14
                        AND p.gender = 'M', 1, 0)) AS col7,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 10 AND 14
                        AND p.gender = 'F', 1, 0)) AS col8,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 15 AND 19
                        AND p.gender = 'M', 1, 0)) AS col9,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 15 AND 19
                        AND p.gender = 'F', 1, 0)) AS col10,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 20 AND 24
                        AND p.gender = 'M', 1, 0)) AS col11,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 20 AND 24
                        AND p.gender = 'F', 1, 0)) AS col12,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 25 AND 49
                        AND p.gender = 'M', 1, 0)) AS col13,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) BETWEEN 25 AND 49
                        AND p.gender = 'F', 1, 0)) AS col14,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) > 50
                        AND p.gender = 'M', 1, 0)) AS col15,
             SUM(IF(TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')) > 50
                        AND p.gender = 'F', 1, 0)) AS col16

      from visit v
        LEFT JOIN person p ON p.person_id=v.patient_id
        LEFT JOIN encounter test_order_encounter ON test_order_encounter.visit_id=v.visit_id
        LEFT JOIN orders test_order_order ON test_order_order.encounter_id=test_order_encounter.encounter_id
        INNER JOIN concept test_order_concept ON test_order_concept.concept_id=test_order_order.concept_id AND test_order_concept.concept_id=165912 OR test_order_concept.concept_id=165866
        WHERE CAST(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT') AS DATE) BETWEEN '2022-12-01' and '2022-12-31'
     ) as h;