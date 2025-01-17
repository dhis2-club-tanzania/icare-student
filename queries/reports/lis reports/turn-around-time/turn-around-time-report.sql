SELECT
sp.label AS lab_no,
test_order_concept_name.name AS test,
(SELECT GROUP_CONCAT(DISTINCT  cn.name)
		FROM lb_sample sample
        INNER JOIN encounter en ON en.visit_id = sample.visit_id
        INNER JOIN obs ob ON ob.encounter_id = en.encounter_id
        INNER JOIN concept c ON c.concept_id = ob.value_coded
		INNER JOIN concept_name cn ON cn.concept_id = c.concept_id and cn.concept_name_type = 'FULLY_SPECIFIED'
        WHERE sample.sample_id = sp.sample_id AND ob.value_coded = 220293

    ) AS priority,
(SELECT GROUP_CONCAT(DISTINCT CASE WHEN va.attribute_type_id=7 THEN l.name ELSE NULL END)
        FROM visit v
        LEFT JOIN visit_attribute va ON va.visit_id = v.visit_id
        LEFT JOIN location l on l.uuid = va.value_reference
        WHERE  v.visit_id = sp.visit_id
		) AS 'health_facility',

(SELECT GROUP_CONCAT( DISTINCT cn.name)
        FROM concept_name cn
        INNER JOIN concept c1 ON c1.concept_id = cn.concept_id AND c1.class_id=36
        WHERE  c1.concept_id = sp.concept_id AND cn.concept_name_type = 'FULLY_SPECIFIED'
		) AS 'work_area',
(SELECT GROUP_CONCAT( DISTINCT CASE WHEN ob.concept_id = 220311 THEN DATE_FORMAT(ob.value_datetime, "%d/%m/%Y %h:%i %p") ELSE NULL END)
     	FROM lb_sample sample
        INNER JOIN encounter en ON en.visit_id = sample.visit_id
        INNER JOIN obs ob ON ob.encounter_id = en.encounter_id
        WHERE sample.sample_id = sp.sample_id
    ) AS 'received_on',
DATE_FORMAT(CONVERT_TZ(sp.date_time,'Etc/GMT+3','GMT'), "%d/%m/%Y %h:%i %p") AS 'registered_on',
(SELECT GROUP_CONCAT( DISTINCT CASE WHEN ob.concept_id = 220300 THEN ROUND((UNIX_TIMESTAMP(CONVERT_TZ(sp.date_time,'Etc/GMT+3','GMT'))- UNIX_TIMESTAMP(ob.value_datetime) )/60,0) ELSE NULL END)
        FROM lb_sample sample
        INNER JOIN encounter en ON en.visit_id = sample.visit_id
        INNER JOIN obs ob ON ob.encounter_id = en.encounter_id
        WHERE sample.sample_id = sp.sample_id
    ) AS collection_registration,
(SELECT GROUP_CONCAT( DISTINCT CASE WHEN ob.concept_id = 220311 THEN ROUND((UNIX_TIMESTAMP(CONVERT_TZ(sp.date_time,'Etc/GMT+3','GMT'))- UNIX_TIMESTAMP(ob.value_datetime) )/60,0) ELSE NULL END)
        FROM lb_sample sample
        INNER JOIN encounter en ON en.visit_id = sample.visit_id
        INNER JOIN obs ob ON ob.encounter_id = en.encounter_id
        WHERE sample.sample_id = sp.sample_id
    ) AS received_registration,
(SELECT GROUP_CONCAT( DISTINCT ROUND((UNIX_TIMESTAMP(st.timestamp)- UNIX_TIMESTAMP(sp.date_time))/60,0) )
          FROM lb_sample_status st
          WHERE sp.sample_id = st.sample_id AND st.category = 'HAS_RESULTS'
--        FROM lb_sample_order so
--        INNER JOIN lb_test_allocation talloc ON talloc.order_id = so.order_id
--        INNER JOIN lb_test_result tres ON tres.test_allocation_id = talloc.test_allocation_id
--        WHERE test_order_order.order_id = talloc.order_id AND  so.sample_id IN ( SELECT st.sample_id FROM lb_sample_status st WHERE st.category = 'HAS_RESULTS' )
    ) AS requested_full_result,
 (SELECT GROUP_CONCAT(  CASE WHEN ob.order_id = so.order_id THEN ROUND((UNIX_TIMESTAMP(ob.obs_datetime)- UNIX_TIMESTAMP(sp.date_time) )/60,0) ELSE NULL END )
         FROM lb_sample_order so
         INNER JOIN lb_sample s ON s.sample_id = so.sample_id
         INNER JOIN obs ob ON ob.order_id = so.order_id
         WHERE test_order_order.order_id = so.order_id
     )AS requested_reviewed



	FROM lb_sample sp
    INNER JOIN lb_sample_status spstatus ON spstatus.sample_id = sp.sample_id AND sp.sample_id NOT IN (SELECT spst.sample_id FROM lb_sample_status spst WHERE (spst.category = 'REJECTED_LABORATORY' OR spst.category ='REJECTED_REGISTRATION'))
    LEFT JOIN concept c ON c.uuid = spstatus.remarks
    LEFT JOIN concept_name cn ON cn.concept_id = c.concept_id and cn.concept_name_type = 'FULLY_SPECIFIED'

    INNER JOIN lb_sample_order so ON so.sample_id = sp.sample_id
	INNER JOIN orders test_order_order ON test_order_order.order_id=so.order_id
	INNER JOIN concept test_order_concept ON test_order_concept.concept_id=test_order_order.concept_id
	INNER JOIN concept_name test_order_concept_name ON test_order_concept_name.concept_id=test_order_concept.concept_id AND test_order_concept_name.concept_name_type='FULLY_SPECIFIED'
    WHERE CAST(CONVERT_TZ(sp.date_time,'Etc/GMT+3','GMT') AS DATE) BETWEEN :startDate AND :endDate
    GROUP BY sp.sample_id,test_order_order.order_id,test
