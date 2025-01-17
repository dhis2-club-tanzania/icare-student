-- Name: Accepted Samples With No Results
-- 
SELECT sample_ref.label,sample_ref.uuid FROM (SELECT ls.label, ls.uuid, ls.sample_id FROM lb_sample ls
LEFT JOIN lb_sample_status lss ON ls.sample_id = lss.sample_id
WHERE ls.sample_id NOT IN (SELECT sample_id FROM lb_sample_status WHERE category = 'HAS_RESULTS' AND ls.date_created BETWEEN :startDate AND :endDate)
AND lss.status = 'ACCEPTED' AND ls.date_created BETWEEN :startDate AND :endDate) as sample_ref LEFT JOIN lb_sample_order lso ON lso.sample_id =sample_ref.sample_id
LEFT JOIN orders o ON lso.order_id = o.order_id 
LEFT JOIN concept c ON c.concept_id = o.concept_id WHERE c.uuid =:uuid;