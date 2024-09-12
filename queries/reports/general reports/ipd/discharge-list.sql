SELECT (@row_number:=@row_number+1) AS "NA",`JINA_LA_MGONJWA`,`TAREHE_YA_KURUHUSIWA`,`JINSIA_YA_MGONJWA`,`WODI` FROM(
SELECT

	UPPER(CONCAT(pn.given_name,' ',pn.family_name)) AS `JINA_LA_MGONJWA`,
	GROUP_CONCAT(DISTINCT DATE_FORMAT(visit_encounter.encounter_datetime, "%d/%m/%Y %h:%i %p")) AS `TAREHE_YA_KURUHUSIWA`,
	GROUP_CONCAT(DISTINCT CASE WHEN p.gender='M' THEN 'Me'  ELSE 'Ke' END) AS `JINSIA_YA_MGONJWA`,
    GROUP_CONCAT(DISTINCT loc2.name) AS `WODI`
	from visit v

-- Addressing names and address
INNER JOIN person p ON p.person_id=v.patient_id
INNER JOIN person_name pn ON p.person_id=pn.person_id

 -- ADDRESSING IPD ENCOUNTER
INNER JOIN encounter visit_encounter ON visit_encounter.visit_id=v.visit_id AND visit_encounter.encounter_type = 1
INNER JOIN location loc ON loc.location_id = visit_encounter.location_id
INNER JOIN location_tag_map loc_map ON loc_map.location_id = loc.location_id AND loc_map.location_tag_id = 8
INNER JOIN location loc2 ON loc2.location_id = loc.parent_location

WHERE (CAST(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT') AS DATE) BETWEEN :startDate AND :endDate)
GROUP BY v.visit_id,`JINA_LA_MGONJWA`
ORDER BY v.date_started ASC) AS VISITDETAILS, (SELECT @row_number:=0) AS temp
