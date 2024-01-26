SELECT
  `HUDHURIO LA KWANZA`,
  Na,
  TAREHE,
  `JINA LA MGONJWA`,
  `MAHALI ANAISHI`,
  UMRI,
  `JINSIA YA MGONJWA`,
  UZITO(kg),
  UREFU(cm),
  VIPIMO,
  MATOKEO YA VIPIMO,
  DIAGNOSIS,
  MATIBABU,
  MATOKEO YA MAHUDHURIO,
  MALIPO
FROM (
  # Join visit with details
  SELECT
    CASE WHEN COUNT(ov.visit_id) > 0 THEN '' ELSE '*' END AS `HUDHURIO LA KWANZA`,
    DATE_FORMAT(CONVERT_TZ(v.date_started, '+03:00', 'GMT'), "%d/%m/%Y %h:%i %p") AS TAREHE,
    CONCAT_WS(' ', pn.given_name, pn.family_name) AS `JINA LA MGONJWA`,
    CONCAT_WS(',', pa.city_village, pa.state_province, pa.address1) AS `MAHALI ANAISHI`,
    DATEDIFF(v.date_started, p.birthdate) / 365 AS UMRI,
    CASE p.gender WHEN 'M' THEN 'Me' ELSE 'Ke' END AS `JINSIA YA MGONJWA`,
    GROUP_CONCAT(ob2.value_numeric) AS `UZITO(kg)`,
    GROUP_CONCAT(ob2.value_numeric) AS `UREFU(cm)`,
    GROUP_CONCAT(DISTINCT ot.name) AS `VIPIMO`,
    GROUP_CONCAT(
      CASE WHEN test_result_concept_name.name IS NULL THEN CONCAT(test_order_concept_name.name, '-', ob.value_text)
      ELSE CONCAT(test_order_concept_name.name, '-', test_result_concept_name.name)
      END
    ) AS `MATOKEO YA VIPIMO`,
    GROUP_CONCAT(DISTINCT CASE WHEN ed.certainty = 'CONFIRMED' THEN diagnosis_concept_name.name ELSE NULL END) AS DIAGNOSIS,
    GROUP_CONCAT(DISTINCT d.name) AS `MATIBABU`,
    GROUP_CONCAT(DISTINCT result_encounter_type.name) AS `MATOKEO YA MAHUDHURIO`,
    payment_concept_name.name AS `MALIPO`
  FROM visit v
  INNER JOIN person p ON p.person_id = v.patient_id
  INNER JOIN person_name pn ON p.person_id = pn.person_id AND pn.preferred = 1
  LEFT JOIN person_address pa ON p.person_id = pa.person_id AND pa.preferred = 1
  LEFT JOIN visit ov ON p.person_id = ov.patient_id AND ov.visit_id != v.visit_id AND ov.date_started < v.date_started AND YEAR(ov.date_started) = YEAR(v.date_started)
  -- Test orders and results
  LEFT JOIN encounter te ON te.visit_id = v.visit_id
  LEFT JOIN orders to ON to.encounter_id = te.encounter_id
  LEFT JOIN order_type ot ON ot.order_type_id = to.order_type_id
  LEFT JOIN concept toc ON toc.concept_id = to.concept_id
  LEFT JOIN concept_name tocn ON tocn.concept_id = toc.concept_id AND tocn.concept_name_type = 'FULLY_SPECIFIED'
  LEFT JOIN obs ob ON ob.order_id = to.order_id
  LEFT JOIN concept_name trcn ON trcn.concept_id = ob.value_coded AND trcn.concept_name_type = 'FULLY_SPECIFIED'
  LEFT JOIN obs ob2 ON ob2.encounter_id = te.encounter_id
  -- Diagnosis
  LEFT JOIN encounter de ON de.visit_id = v.visit_id
  LEFT JOIN encounter_diagnosis ed ON ed.encounter_id = de.encounter_id
  LEFT JOIN concept dc ON ed.diagnosis_coded = dc.concept_id
  LEFT JOIN concept_name dcn ON dcn.concept_id = dc.concept_id
  -- Prescriptions and drugs
  LEFT JOIN prescription do ON do.order_id = to.order_id
  LEFT JOIN drug d ON d.drug_id
