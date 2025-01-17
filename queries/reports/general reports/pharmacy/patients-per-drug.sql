SELECT
CONCAT(pn.given_name,' ',pn.family_name) AS `JINA LA MGONJWA`,
d.name AS `DRUG NAME`,
v.date_started AS `VISIT DATE`

FROM
patient pt
-- Addressing names and address
LEFT JOIN person p ON p.person_id=pt.patient_id
LEFT JOIN person_name pn ON p.person_id=pn.person_id
LEFT JOIN person_address pa ON p.person_id=pa.person_id

-- Addressing visit
LEFT JOIN visit v ON v.patient_id = pt.patient_id
LEFT JOIN encounter drug_order_encounter ON drug_order_encounter.visit_id=v.visit_id
LEFT JOIN orders drug_order_order ON drug_order_order.encounter_id=drug_order_encounter.encounter_id

-- Addressing Matibabu
INNER JOIN drug_order do ON do.order_id=drug_order_order.order_id
INNER JOIN prescription pre ON pre.drug_inventory_id=do.drug_inventory_id
LEFT JOIN drug d ON d.drug_id=pre.drug_inventory_id
LEFT JOIN item i ON i.drug_id=d.drug_id

WHERE v.date_started BETWEEN :startDate AND :endDate AND i.uuid= :itemUuid;

-- UUID FOR TESTING
--'3ab35f6e-a36a-4e25-960e-709bfef65c0a'


