SELECT (@row_number:=@row_number+1) AS "Na",`Visit Date`,`Time (24hrs)`,Name,Gender,`Patient Type`,`Age in yrs`,`Visit Type`,`Visit Category`,`Payment Category`,`Insurance Type`,`Charged For`,`Reception Staff` FROM(
SELECT
    DATE_FORMAT(DATE(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')), '%d-%m-%Y') AS "Visit Date",
    DATE_FORMAT( CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'), '%H:%i:%s') AS "Time (24hrs)",
    CASE WHEN pn.middle_name IS NOT NULL THEN UPPER(CONCAT(pn.given_name,' ',pn.middle_name,' ',pn.family_name)) ELSE UPPER(CONCAT(pn.given_name,' ',pn.family_name)) END AS Name,
    p.gender AS Gender,
    (SELECT pa.value
		FROM person_attribute pa
        WHERE pa.person_attribute_type_id=68 AND pa.person_id=p.person_id
    ) AS `Patient Type`,
    ROUND(FLOOR(DATEDIFF(CURDATE(), p.birthdate) / 365.25) - 0.4999) AS "Age in yrs",
    vt.name as "Visit Type",
    if(p.date_created < DATE(DATE_FORMAT(DATE(v.date_started), '%Y-%m-%d')), "REVISIT", "NEW") AS "Visit Category",
    cptnpc.name AS "Payment Category",
    cptni.name AS "Insurance Type",
    cptnb.name AS "Charged For",
    UPPER(CONCAT(pname.given_name,' ', pname.family_name)) AS "Reception Staff"
FROM
    visit v
LEFT JOIN person p ON p.person_id = v.patient_id
INNER JOIN person_name pn ON pn.person_id = p.person_id
LEFT JOIN visit_attribute payment_category ON payment_category.visit_id =v.visit_id and payment_category.attribute_type_id = 1
LEFT JOIN concept cptpc ON cptpc.uuid = payment_category.value_reference
LEFT JOIN concept_name cptnpc ON cptnpc.concept_id = cptpc.concept_id AND cptnpc.concept_name_type = 'FULLY_SPECIFIED'

LEFT JOIN visit_attribute insurance ON insurance.visit_id =v.visit_id and insurance.attribute_type_id = 4
LEFT JOIN concept cpti ON cpti.uuid = insurance.value_reference
LEFT JOIN concept_name cptni ON cptni.concept_id = cpti.concept_id AND cptni.concept_name_type = 'FULLY_SPECIFIED'


LEFT JOIN visit_attribute billing_item ON billing_item.visit_id =v.visit_id and billing_item.attribute_type_id = 3
LEFT JOIN concept cptb ON cptb.uuid = billing_item.value_reference
LEFT JOIN concept_name cptnb ON cptnb.concept_id = cptb.concept_id AND cptnb.concept_name_type = 'FULLY_SPECIFIED'

LEFT JOIN visit_type vt ON vt.visit_type_id = v.visit_type_id

LEFT JOIN users ON users.user_id = v.creator
LEFT JOIN person creator ON creator.person_id = users.person_id
LEFT JOIN person_name pname ON pname.person_id = creator.person_id
WHERE CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')  BETWEEN :startDate AND :endDate) AS PATIENTDETAILS, (SELECT @row_number:=0) AS temp