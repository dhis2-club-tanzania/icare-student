# MRDT
#Query for mrdt +ve and -ve mrdt results
SELECT concat("mRDT", "- positive")                                     as "Maelezo",
       Concat('X9fBUnQiiQE-aKZHqMqowxE:',COALESCE(SUM(IF(
           testResults.value_coded_concept_id IS NOT NULL AND
           ROUND(TIMESTAMPDIFF(MONTH, testResults.birthdate, CURDATE())) < 1
                  AND testResults.gender = 'M', 1, 0)),0)) AS "Me chini ya mwezi 1",
       Concat('X9fBUnQiiQE-mnZxRv5VRBe:',COALESCE(SUM(IF(
           testResults.value_coded_concept_id IS NOT NULL AND ROUND(TIMESTAMPDIFF(MONTH, testResults.birthdate, CURDATE())) < 1
                  AND testResults.gender = 'F', 1, 0)),0)) AS "Ke chini ya mwezi 1",
       Concat('X9fBUnQiiQE-CRTwqxK8aMA:',COALESCE(SUM(IF(
           testResults.value_coded_concept_id IS NOT NULL AND
           ROUND(TIMESTAMPDIFF(MONTH, testResults.birthdate, CURDATE())) < 12
                  AND (ROUND(TIMESTAMPDIFF(MONTH, testResults.birthdate, CURDATE()))) > 1
                  AND testResults.gender = 'M', 1, 0)),0)) AS "Me mwezi 1 hadi mwaka 1",
       Concat('X9fBUnQiiQE-g72fFJHnOBC:',COALESCE(SUM(IF(
           testResults.value_coded_concept_id IS NOT NULL AND
           ROUND(TIMESTAMPDIFF(MONTH, testResults.birthdate, CURDATE())) < 12
                  AND (ROUND(TIMESTAMPDIFF(MONTH, testResults.birthdate, CURDATE()))) > 1
                  AND testResults.gender = 'F', 1, 0)),0)) AS "Ke mwezi 1 hadi mwaka 1",
       Concat('X9fBUnQiiQE-VO7jXQW0pHo:',COALESCE(SUM(IF(
           testResults.value_coded_concept_id IS NOT NULL AND
           ROUND(FLOOR(DATEDIFF(CURDATE(), testResults.birthdate) / 365.25) - 0.4999) < 5
                  AND ROUND(FLOOR(DATEDIFF(CURDATE(), testResults.birthdate) / 365.25) - 0.4999) > 1
                  AND testResults.gender = 'M', 1, 0)),0)) AS "Me mwaka 1 hadi 4",
       Concat('X9fBUnQiiQE-qHWUKtukjAU:',COALESCE(SUM(IF(
           testResults.value_coded_concept_id IS NOT NULL AND
           ROUND(FLOOR(DATEDIFF(CURDATE(), testResults.birthdate) / 365.25) - 0.4999) < 5
                  AND ROUND(FLOOR(DATEDIFF(CURDATE(), testResults.birthdate) / 365.25) - 0.4999) > 1
                  AND testResults.gender = 'F', 1, 0)),0)) AS "Ke mwaka 1 hadi 4",
       Concat('X9fBUnQiiQE-Fx7ApyIS3oe:',COALESCE(SUM(IF(
           testResults.value_coded_concept_id IS NOT NULL AND
           ROUND(FLOOR(DATEDIFF(CURDATE(), testResults.birthdate) / 365.25) - 0.4999) > 5
                  AND testResults.gender = 'M', 1, 0)),0)) AS "Me zaidi ya miaka 5",
       Concat('X9fBUnQiiQE-hJPgvKbv4xM:',COALESCE(SUM(IF(
           testResults.value_coded_concept_id IS NOT NULL AND
           ROUND(FLOOR(DATEDIFF(CURDATE(), testResults.birthdate) / 365.25) - 0.4999) > 5
                  AND testResults.gender = 'F', 1, 0)),0)) AS "Ke zaidi ya miaka 5"
FROM (select o.order_id, o.patient_id, lbrs.value_coded_concept_id, per.birthdate, per.gender, cn.name
      from orders o
               left join lb_test_allocation lbta on lbta.order_id = o.order_id and (o.concept_id = 29867 or o.concept_id = 14529)
               left join lb_test_result lbrs on lbrs.test_allocation_id = lbta.test_allocation_id
                                                    and lbrs.value_coded_concept_id = 14670
               left join person per on per.person_id = o.patient_id
                left join concept c on c.concept_id = o.concept_id
                left join concept_name cn on cn.concept_id = c.concept_id and cn.concept_name_type = 'FULLY_SPECIFIED'
      where o.order_id in
            (select distinct lta.order_id
             from lb_test_allocation lta
             where test_allocation_id in (select distinct test_allocation_id from lb_test_result))
        and Cast(o.date_created AS DATE) BETWEEN '03-03-2021' AND '06-06-2021') as testResults
-- LEFT JOIN concept_name test_name ON test_name.concept_id = 29867 AND test_name.concept_name_type = 'FULLY_SPECIFIED'


UNION ALL

SELECT concat("mRDT", "- negative")                                     as "Maelezo",
       Concat('yfWQukYAe6n-aKZHqMqowxE:',COALESCE(SUM(IF(testResults.value_coded_concept_id IS NOT NULL AND
              ROUND(TIMESTAMPDIFF(MONTH, testResults.birthdate, CURDATE())) < 1
                  AND testResults.gender = 'M', 1, 0)),0)) AS "Me chini ya mwezi 1",
       Concat('yfWQukYAe6n-mnZxRv5VRBe:',COALESCE(SUM(IF(testResults.value_coded_concept_id IS NOT NULL AND
              ROUND(TIMESTAMPDIFF(MONTH, testResults.birthdate, CURDATE())) < 1
                  AND testResults.gender = 'F', 1, 0)),0)) AS "Ke chini ya mwezi 1",
       Concat('yfWQukYAe6n-CRTwqxK8aMA:',COALESCE(SUM(IF(testResults.value_coded_concept_id IS NOT NULL AND
              ROUND(TIMESTAMPDIFF(MONTH, testResults.birthdate, CURDATE())) < 12
                  AND (ROUND(TIMESTAMPDIFF(MONTH, testResults.birthdate, CURDATE()))) > 1
                  AND testResults.gender = 'M', 1, 0)),0)) AS "Me mwezi 1 hadi mwaka 1",
       Concat('yfWQukYAe6n-g72fFJHnOBC:',COALESCE(SUM(IF(testResults.value_coded_concept_id IS NOT NULL AND
              ROUND(TIMESTAMPDIFF(MONTH, testResults.birthdate, CURDATE())) < 12
                  AND (ROUND(TIMESTAMPDIFF(MONTH, testResults.birthdate, CURDATE()))) > 1
                  AND testResults.gender = 'F', 1, 0)),0)) AS "Ke mwezi 1 hadi mwaka 1",
       Concat('yfWQukYAe6n-VO7jXQW0pHo:',COALESCE(SUM(IF(testResults.value_coded_concept_id IS NOT NULL AND
              ROUND(FLOOR(DATEDIFF(CURDATE(), testResults.birthdate) / 365.25) - 0.4999) < 5
                  AND ROUND(FLOOR(DATEDIFF(CURDATE(), testResults.birthdate) / 365.25) - 0.4999) > 1
                  AND testResults.gender = 'M', 1, 0)),0)) AS "Me mwaka 1 hadi 4",
       Concat('yfWQukYAe6n-qHWUKtukjAU:',COALESCE(SUM(IF(testResults.value_coded_concept_id IS NOT NULL AND
              ROUND(FLOOR(DATEDIFF(CURDATE(), testResults.birthdate) / 365.25) - 0.4999) < 5
                  AND ROUND(FLOOR(DATEDIFF(CURDATE(), testResults.birthdate) / 365.25) - 0.4999) > 1
                  AND testResults.gender = 'F', 1, 0)),0)) AS "Ke mwaka 1 hadi 4",
       Concat('yfWQukYAe6n-Fx7ApyIS3oe:',COALESCE(SUM(IF(testResults.value_coded_concept_id IS NOT NULL AND
              ROUND(FLOOR(DATEDIFF(CURDATE(), testResults.birthdate) / 365.25) - 0.4999) > 5
                  AND testResults.gender = 'M', 1, 0)),0)) AS "Me zaidi ya miaka 5",
       Concat('yfWQukYAe6n-hJPgvKbv4xM:',COALESCE(SUM(IF(testResults.value_coded_concept_id IS NOT NULL AND
              ROUND(FLOOR(DATEDIFF(CURDATE(), testResults.birthdate) / 365.25) - 0.4999) > 5
                  AND testResults.gender = 'F', 1, 0)),0)) AS "Ke zaidi ya miaka 5"
FROM (select o.order_id, o.patient_id, lbrs.value_coded_concept_id, per.birthdate, per.gender, cn.name
      from orders o
               left join lb_test_allocation lbta on lbta.order_id = o.order_id and (o.concept_id = 29867 or o.concept_id = 14529)
               left join lb_test_result lbrs on lbrs.test_allocation_id = lbta.test_allocation_id
                    and lbrs.value_coded_concept_id = 14671
               left join person per on per.person_id = o.patient_id
                left join concept c on c.concept_id = o.concept_id
                left join concept_name cn on cn.concept_id = c.concept_id and cn.concept_name_type = 'FULLY_SPECIFIED'
      where o.order_id in
            (select distinct lta.order_id
             from lb_test_allocation lta
             where test_allocation_id in (select distinct test_allocation_id from lb_test_result))
        and Cast(o.date_created AS DATE) BETWEEN '03-03-2021' AND '06-06-2021') as testResults
-- LEFT JOIN concept_name test_name ON test_name.concept_id = 29867 AND test_name.concept_name_type = 'FULLY_SPECIFIED'

UNION ALL

# Blood Slide for Parasites (BS)

SELECT concat("BS", "- PARASITES SEEN")                                     as "Maelezo",
       Concat('BfvvJ4rSAVf-aKZHqMqowxE:',COALESCE(SUM(IF(testResults.value_coded_concept_id IS NOT NULL AND
              ROUND(TIMESTAMPDIFF(MONTH, testResults.birthdate, CURDATE())) < 1
                  AND testResults.gender = 'M', 1, 0)),0)) AS "Me chini ya mwezi 1",
       Concat('BfvvJ4rSAVf-mnZxRv5VRBe:',COALESCE(SUM(IF(testResults.value_coded_concept_id IS NOT NULL AND
              ROUND(TIMESTAMPDIFF(MONTH, testResults.birthdate, CURDATE())) < 1
                  AND testResults.gender = 'F', 1, 0)),0)) AS "Ke chini ya mwezi 1",
       Concat('BfvvJ4rSAVf-CRTwqxK8aMA:',COALESCE(SUM(IF(testResults.value_coded_concept_id IS NOT NULL AND
              ROUND(TIMESTAMPDIFF(MONTH, testResults.birthdate, CURDATE())) < 12
                  AND (ROUND(TIMESTAMPDIFF(MONTH, testResults.birthdate, CURDATE()))) > 1
                  AND testResults.gender = 'M', 1, 0)),0)) AS "Me mwezi 1 hadi mwaka 1",
       Concat('BfvvJ4rSAVf-g72fFJHnOBC:',COALESCE(SUM(IF(testResults.value_coded_concept_id IS NOT NULL AND
              ROUND(TIMESTAMPDIFF(MONTH, testResults.birthdate, CURDATE())) < 12
                  AND (ROUND(TIMESTAMPDIFF(MONTH, testResults.birthdate, CURDATE()))) > 1
                  AND testResults.gender = 'F', 1, 0)),0)) AS "Ke mwezi 1 hadi mwaka 1",
       Concat('BfvvJ4rSAVf-VO7jXQW0pHo:',COALESCE(SUM(IF(testResults.value_coded_concept_id IS NOT NULL AND
              ROUND(FLOOR(DATEDIFF(CURDATE(), testResults.birthdate) / 365.25) - 0.4999) < 5
                  AND ROUND(FLOOR(DATEDIFF(CURDATE(), testResults.birthdate) / 365.25) - 0.4999) > 1
                  AND testResults.gender = 'M', 1, 0)),0)) AS "Me mwaka 1 hadi 4",
       Concat('BfvvJ4rSAVf-qHWUKtukjAU:',COALESCE(SUM(IF(testResults.value_coded_concept_id IS NOT NULL AND
              ROUND(FLOOR(DATEDIFF(CURDATE(), testResults.birthdate) / 365.25) - 0.4999) < 5
                  AND ROUND(FLOOR(DATEDIFF(CURDATE(), testResults.birthdate) / 365.25) - 0.4999) > 1
                  AND testResults.gender = 'F', 1, 0)),0)) AS "Ke mwaka 1 hadi 4",
       Concat('BfvvJ4rSAVf-Fx7ApyIS3oe:',COALESCE(SUM(IF(testResults.value_coded_concept_id IS NOT NULL AND
              ROUND(FLOOR(DATEDIFF(CURDATE(), testResults.birthdate) / 365.25) - 0.4999) > 5
                  AND testResults.gender = 'M', 1, 0)),0)) AS "Me zaidi ya miaka 5",
       Concat('BfvvJ4rSAVf-hJPgvKbv4xM:',COALESCE(SUM(IF(testResults.value_coded_concept_id IS NOT NULL AND
              ROUND(FLOOR(DATEDIFF(CURDATE(), testResults.birthdate) / 365.25) - 0.4999) > 5
                  AND testResults.gender = 'F', 1, 0)),0)) AS "Ke zaidi ya miaka 5"
FROM (select o.order_id, o.patient_id, lbrs.value_coded_concept_id, per.birthdate, per.gender, cn.name
      from orders o
               left join lb_test_allocation lbta on lbta.order_id = o.order_id and o.concept_id  and (o.concept_id = 4716 or o.concept_id = 14527)
               left join lb_test_result lbrs on lbrs.test_allocation_id = lbta.test_allocation_id
                    and lbrs.value_coded_concept_id IN (SELECT o_cn.concept_id FROM concept_name o_cn WHERE o_cn.name = 'PARASITES SEEN' and o_cn.concept_name_type = 'FULLY_SPECIFIED')
               left join person per on per.person_id = o.patient_id
                left join concept c on c.concept_id = o.concept_id
                left join concept_name cn on cn.concept_id = c.concept_id and cn.concept_name_type = 'FULLY_SPECIFIED'
      where o.order_id in
            (select distinct lta.order_id
             from lb_test_allocation lta
             where test_allocation_id in (select distinct test_allocation_id from lb_test_result))
        and Cast(o.date_created AS DATE) BETWEEN '03-03-2021' AND '06-06-2021') as testResults
-- LEFT JOIN concept_name test_name ON test_name.concept_id = 14527 AND test_name.concept_name_type = 'FULLY_SPECIFIED'


UNION ALL

SELECT concat("BS", "- NO PARASITES SEEN")                                     as "Maelezo",
       Concat('IXK4ElCK3OS-aKZHqMqowxE:',COALESCE(SUM(IF(testResults.value_coded_concept_id IS NOT NULL AND
              ROUND(TIMESTAMPDIFF(MONTH, testResults.birthdate, CURDATE())) < 1
                  AND testResults.gender = 'M', 1, 0)),0)) AS "Me chini ya mwezi 1",
       Concat('IXK4ElCK3OS-mnZxRv5VRBe:',COALESCE(SUM(IF(testResults.value_coded_concept_id IS NOT NULL AND
              ROUND(TIMESTAMPDIFF(MONTH, testResults.birthdate, CURDATE())) < 1
                  AND testResults.gender = 'F', 1, 0)),0)) AS "Ke chini ya mwezi 1",
       Concat('IXK4ElCK3OS-CRTwqxK8aMA:',COALESCE(SUM(IF(testResults.value_coded_concept_id IS NOT NULL AND
              ROUND(TIMESTAMPDIFF(MONTH, testResults.birthdate, CURDATE())) < 12
                  AND (ROUND(TIMESTAMPDIFF(MONTH, testResults.birthdate, CURDATE()))) > 1
                  AND testResults.gender = 'M', 1, 0)),0)) AS "Me mwezi 1 hadi mwaka 1",
       Concat('IXK4ElCK3OS-g72fFJHnOBC:',COALESCE(SUM(IF(testResults.value_coded_concept_id IS NOT NULL AND
              ROUND(TIMESTAMPDIFF(MONTH, testResults.birthdate, CURDATE())) < 12
                  AND (ROUND(TIMESTAMPDIFF(MONTH, testResults.birthdate, CURDATE()))) > 1
                  AND testResults.gender = 'F', 1, 0)),0)) AS "Ke mwezi 1 hadi mwaka 1",
       Concat('IXK4ElCK3OS-VO7jXQW0pHo:',COALESCE(SUM(IF(testResults.value_coded_concept_id IS NOT NULL AND
              ROUND(FLOOR(DATEDIFF(CURDATE(), testResults.birthdate) / 365.25) - 0.4999) < 5
                  AND ROUND(FLOOR(DATEDIFF(CURDATE(), testResults.birthdate) / 365.25) - 0.4999) > 1
                  AND testResults.gender = 'M', 1, 0)),0)) AS "Me mwaka 1 hadi 4",
       Concat('IXK4ElCK3OS-qHWUKtukjAU:',COALESCE(SUM(IF(testResults.value_coded_concept_id IS NOT NULL AND
              ROUND(FLOOR(DATEDIFF(CURDATE(), testResults.birthdate) / 365.25) - 0.4999) < 5
                  AND ROUND(FLOOR(DATEDIFF(CURDATE(), testResults.birthdate) / 365.25) - 0.4999) > 1
                  AND testResults.gender = 'F', 1, 0)),0)) AS "Ke mwaka 1 hadi 4",
       Concat('IXK4ElCK3OS-Fx7ApyIS3oe:',COALESCE(SUM(IF(testResults.value_coded_concept_id IS NOT NULL AND
              ROUND(FLOOR(DATEDIFF(CURDATE(), testResults.birthdate) / 365.25) - 0.4999) > 5
                  AND testResults.gender = 'M', 1, 0)),0)) AS "Me zaidi ya miaka 5",
       Concat('IXK4ElCK3OS-hJPgvKbv4xM:',COALESCE(SUM(IF(testResults.value_coded_concept_id IS NOT NULL AND
              ROUND(FLOOR(DATEDIFF(CURDATE(), testResults.birthdate) / 365.25) - 0.4999) > 5
                  AND testResults.gender = 'F', 1, 0)),0)) AS "Ke zaidi ya miaka 5"
FROM (select o.order_id, o.patient_id, lbrs.value_coded_concept_id, per.birthdate, per.gender, cn.name
      from orders o
               left join lb_test_allocation lbta on lbta.order_id = o.order_id and (o.concept_id = 4716 or o.concept_id = 14527)
               left join lb_test_result lbrs on lbrs.test_allocation_id = lbta.test_allocation_id
                    and lbrs.value_coded_concept_id IN (SELECT o_cn.concept_id FROM concept_name o_cn WHERE o_cn.name = 'NO PARASITES SEEN' and o_cn.concept_name_type = 'FULLY_SPECIFIED')
               left join person per on per.person_id = o.patient_id
                left join concept c on c.concept_id = o.concept_id
                left join concept_name cn on cn.concept_id = c.concept_id and cn.concept_name_type = 'FULLY_SPECIFIED'
      where o.order_id in
            (select distinct lta.order_id
             from lb_test_allocation lta
             where test_allocation_id in (select distinct test_allocation_id from lb_test_result))
        and Cast(o.date_created AS DATE) BETWEEN '03-03-2021' AND '06-06-2021') as testResults