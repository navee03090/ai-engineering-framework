-- EcoMind AI seed — mock environmental services for hackathon demo
-- Run after 00004_civicai.sql

delete from public.government_services;

insert into public.government_services (
  slug, name, category, department, office_name, office_address, description,
  fee, processing_time, documents, warnings, instructions, icon, popular
) values
(
  'garbage-collection', 'Garbage Collection', 'waste',
  'Lahore Waste Management Company (LWMC)', 'LWMC Regional Office', 'LWMC HQ, Lahore',
  'Report missed garbage collection, overflowing bins, or schedule municipal pickup.',
  'Free municipal service', '24–48 hours',
  '["Photo of overflowing garbage","GPS location or landmark","Date and time observed","Brief description"]'::jsonb,
  '["Do not touch hazardous waste","Keep children away from overflowing bins","Segregate recyclables when possible"]'::jsonb,
  '["Report via EcoMind AI or LWMC helpline 1139","Note exact location and bin number if visible","LWMC dispatches collection crew","Follow up if not collected within 48 hours"]'::jsonb,
  'Trash2', true
),
(
  'illegal-dumping', 'Illegal Dumping', 'waste',
  'Lahore Waste Management Company (LWMC)', 'LWMC Enforcement Unit', 'Ring Road area office, Lahore',
  'Report unauthorized waste disposal, illegal dumping sites, and fly-tipping near roads or vacant plots.',
  'Free municipal service', '24–72 hours',
  '["Photo of dumped waste","GPS location or landmark","Date observed","Type of waste if known"]'::jsonb,
  '["Do not confront dumpers directly","Avoid touching chemical or medical waste","This image may indicate unauthorized waste disposal — report to municipal authority"]'::jsonb,
  '["Document location with photo and GPS","Report to LWMC enforcement via EcoMind AI","Municipal team inspects and schedules cleanup","Repeat offenders may face fines under local bylaws"]'::jsonb,
  'AlertTriangle', true
),
(
  'recycling-center', 'Recycling Center', 'recycling',
  'Punjab Environmental Protection Department', 'Nearest Recycling Facility', 'City recycling drop-off centers',
  'Find nearby recycling centers for paper, plastic, metal, and e-waste disposal.',
  'Free or nominal fee', 'Same day (drop-off)',
  '["List of materials to recycle","Photo of items (optional)","Preferred city/area"]'::jsonb,
  '["Rinse containers before recycling","Separate e-waste from regular recyclables","Check facility hours before visiting"]'::jsonb,
  '["Identify recyclable materials","Locate nearest certified recycling center on map","Drop off during operating hours","Request receipt for bulk commercial waste"]'::jsonb,
  'Recycle', false
),
(
  'industrial-waste', 'Industrial Waste', 'pollution',
  'Environmental Protection Agency (EPA) Punjab', 'EPA Regional Office', 'EPA Punjab HQ, Lahore',
  'Report industrial waste dumping, factory emissions, or unauthorized disposal of manufacturing byproducts.',
  'Free complaint service', '3–7 working days',
  '["Photo or video evidence","Factory or site location","Date and time","Description of waste type"]'::jsonb,
  '["Stay upwind of chemical emissions","Do not enter restricted industrial zones","Report suspected violations to EPA — do not accuse individuals"]'::jsonb,
  '["Document evidence from safe distance","File complaint with EPA Punjab","EPA inspects site and issues notice if violation found","Follow-up inspection within 7 days"]'::jsonb,
  'Factory', false
),
(
  'hazardous-waste', 'Hazardous Waste', 'pollution',
  'Environmental Protection Agency (EPA) Punjab', 'EPA Hazardous Waste Unit', 'EPA Punjab HQ, Lahore',
  'Report chemical waste, medical waste, batteries, or other hazardous materials improperly disposed.',
  'Free emergency reporting', '12–48 hours (urgent: same day)',
  '["Photo from safe distance","Exact location","Type of hazard if known","CNIC for follow-up"]'::jsonb,
  '["Never touch unknown chemicals","Evacuate area if strong fumes present","Call emergency services for immediate danger"]'::jsonb,
  '["Mark area and warn others","Report to EPA hazardous waste unit","Specialized disposal team dispatched","Area cordoned until safe removal"]'::jsonb,
  'Biohazard', false
),
(
  'blocked-drain', 'Blocked Drain', 'infrastructure',
  'Water & Sanitation Agency (WASA)', 'WASA Complaint Cell', 'WASA regional office',
  'Report blocked drains, sewage overflow, and stagnant water causing health hazards.',
  'Free municipal service', '24–72 hours',
  '["Photo of blocked drain","Street address or landmark","Duration of blockage","Flood or overflow status"]'::jsonb,
  '["Avoid contact with sewage water","Use alternate routes if street flooded","Report stagnant water to prevent dengue breeding"]'::jsonb,
  '["Report location to WASA complaint cell","Crew dispatched for inspection","Drain cleared and disinfected if needed","Follow-up within 72 hours"]'::jsonb,
  'Droplets', false
),
(
  'plastic-pollution', 'Plastic Pollution', 'pollution',
  'Punjab Environmental Protection Department', 'Environmental Protection Office', 'District EPA office',
  'Report plastic waste in canals, parks, roadsides, and public spaces.',
  'Free municipal service', '3–5 working days',
  '["Photo of plastic accumulation","Water body or park name","Approximate area size","Date observed"]'::jsonb,
  '["Reduce single-use plastic in daily life","Participate in community cleanups","Plastic in canals affects water supply — report promptly"]'::jsonb,
  '["Document pollution hotspot","Report to municipal sanitation and EPA","Cleanup drive scheduled","Long-term monitoring at hotspot"]'::jsonb,
  'Package', false
),
(
  'air-pollution', 'Air Pollution', 'pollution',
  'Environmental Protection Agency (EPA) Punjab', 'EPA Air Quality Monitoring', 'EPA Punjab HQ',
  'Report smoke from burning garbage, industrial chimneys, or vehicle emissions causing air quality issues.',
  'Free complaint service', '2–5 working days',
  '["Photo or video of smoke source","Location and landmark","Time of day","Duration of pollution"]'::jsonb,
  '["Burning garbage releases toxic fumes — report immediately","Stay indoors if air quality is poor","Mask recommended near heavy smoke"]'::jsonb,
  '["Document smoke source safely","File air pollution complaint with EPA","Inspection team visits site","Enforcement action if violation confirmed"]'::jsonb,
  'Wind', false
),
(
  'water-pollution', 'Water Pollution', 'pollution',
  'Environmental Protection Agency (EPA) Punjab', 'EPA Water Quality Unit', 'EPA Punjab HQ',
  'Report polluted canals, rivers, groundwater contamination, or industrial discharge into water bodies.',
  'Free complaint service', '3–7 working days',
  '["Photo of discolored or foamy water","Canal or river name","Upstream source if visible","Date observed"]'::jsonb,
  '["Do not use polluted water for drinking or irrigation","Report chemical discoloration immediately","Water pollution affects entire communities"]'::jsonb,
  '["Document pollution with photos","Report to EPA water quality unit","Water sample collection if warranted","Cleanup and source tracing initiated"]'::jsonb,
  'Waves', true
),
(
  'tree-plantation', 'Tree Plantation', 'green',
  'Forest & Wildlife Department / Parks Authority', 'Parks & Horticulture Office', 'District parks office',
  'Request tree plantation, report illegal tree cutting, or join municipal greening programs.',
  'Free (community programs)', '7–30 days',
  '["Location for plantation","Number of trees requested","Land ownership status","Contact for follow-up"]'::jsonb,
  '["Choose native species for local climate","Water newly planted trees regularly","Report illegal cutting to forest department"]'::jsonb,
  '["Submit plantation request via EcoMind AI","Site survey by horticulture team","Saplings provided on approved dates","Maintenance schedule shared"]'::jsonb,
  'TreePine', false
),
(
  'public-cleaning', 'Public Cleaning', 'waste',
  'Lahore Waste Management Company (LWMC)', 'LWMC Sanitation Division', 'LWMC HQ, Lahore',
  'Request public area cleaning, street sweeping, or post-event cleanup in parks and markets.',
  'Free municipal service', '24–48 hours',
  '["Photo of area needing cleaning","Public place name","Event date if applicable","Size of area"]'::jsonb,
  '["Community participation speeds cleanup","Separate waste before municipal collection","Keep public spaces litter-free"]'::jsonb,
  '["Report area to LWMC sanitation","Crew assigned to location","Cleaning completed and verified","Regular schedule for high-traffic areas"]'::jsonb,
  'Sparkles', false
),
(
  'environmental-complaint', 'Environmental Complaint', 'general',
  'Pakistan Environmental Protection Agency', 'EPA Complaint Center', 'National EPA liaison office',
  'General environmental complaints — noise, odor, wildlife disturbance, or unclassified environmental issues.',
  'Free complaint service', '5–10 working days',
  '["Description of issue","Location","Date and duration","Supporting photos or videos"]'::jsonb,
  '["Document all environmental concerns","Use polite and factual language","Multiple reports help prioritize response"]'::jsonb,
  '["File complaint with relevant authority","Case assigned to appropriate department","Investigation and response","Status update via EcoMind AI history"]'::jsonb,
  'MessageSquare', false
)
on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  department = excluded.department,
  office_name = excluded.office_name,
  office_address = excluded.office_address,
  description = excluded.description,
  fee = excluded.fee,
  processing_time = excluded.processing_time,
  documents = excluded.documents,
  warnings = excluded.warnings,
  instructions = excluded.instructions,
  icon = excluded.icon,
  popular = excluded.popular;
