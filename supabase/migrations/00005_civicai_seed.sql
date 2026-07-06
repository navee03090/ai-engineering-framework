-- CivicAI seed — mock government services for hackathon demo
-- Run after 00004_civicai.sql

insert into public.government_services (
  slug, name, category, department, office_name, office_address, description,
  fee, processing_time, documents, warnings, instructions, icon, popular
) values
(
  'driving-license', 'Driving License Renewal', 'transport',
  'Traffic Police / Licensing Authority', 'District Licensing Center', 'Nearest Traffic Police Office',
  'Renew your driving license with official document requirements and fee guidance.',
  'PKR 1,800', '7–14 working days',
  '["CNIC","Old driving license","Medical certificate","Passport photos"]'::jsonb,
  '["Only pay PKR 1,800 at official counter","Avoid unofficial facilitation fees"]'::jsonb,
  '["Visit licensing center with all documents","Complete biometric verification","Pay official fee and keep receipt","Collect license after processing period"]'::jsonb,
  'Car', true
),
(
  'passport', 'Passport Application', 'identity',
  'Directorate General of Immigration & Passports', 'Regional Passport Office', 'Major city passport offices',
  'Apply for a new passport or renewal with step-by-step procedure guidance.',
  'PKR 12,000 – 25,000', '10–21 working days',
  '["CNIC","Previous passport","Bank challan","Photographs"]'::jsonb,
  '["Pay only official challan amount","Beware of agents promising faster processing"]'::jsonb,
  '["Fill online form at passport.gov.pk","Pay bank challan","Visit office for biometric","Track application online"]'::jsonb,
  'BookOpen', true
),
(
  'cnic', 'CNIC / NICOP', 'identity',
  'NADRA', 'NADRA Registration Center', 'Nearest NADRA office',
  'Apply for CNIC, renewal, or NICOP for overseas Pakistanis.',
  'PKR 0 – 15,000', '15–30 days',
  '["Birth certificate","Parent CNIC","Proof of address","Photographs"]'::jsonb,
  '["NADRA has fixed fee schedule — verify on nadra.gov.pk"]'::jsonb,
  '["Visit NADRA center","Submit documents","Biometric capture","Collect CNIC on notification"]'::jsonb,
  'IdCard', true
),
(
  'birth-certificate', 'Birth Certificate', 'records',
  'Union Council / NADRA', 'Union Council Office', 'Local union council',
  'Obtain or verify a birth certificate for official use.',
  'PKR 200 – 500', '3–7 working days',
  '["Parent CNIC","Hospital birth record","Affidavit (if applicable)"]'::jsonb,
  '[]'::jsonb,
  '["Apply at union council","Submit hospital record","Obtain NADRA-verified copy if needed"]'::jsonb,
  'Baby', false
),
(
  'vehicle-registration', 'Vehicle Registration', 'transport',
  'Excise & Taxation Department', 'Excise Office', 'District excise office',
  'Register a new vehicle or transfer ownership officially.',
  'Varies by vehicle', '3–10 working days',
  '["CNIC","Purchase invoice","Token tax receipt","Insurance"]'::jsonb,
  '["Pay token tax only at designated banks"]'::jsonb,
  '["Submit documents at excise office","Pay registration fee","Collect registration book"]'::jsonb,
  'Truck', false
),
(
  'property-transfer', 'Property Transfer', 'property',
  'Sub-Registrar Office', 'Sub-Registrar Office', 'District registrar office',
  'Transfer property ownership with stamp duty and registry guidance.',
  'Stamp duty + registration fee', '7–21 working days',
  '["CNIC","Sale deed","Fard","NOC (if applicable)","Tax clearance"]'::jsonb,
  '["Stamp duty is calculated officially — verify at registrar office"]'::jsonb,
  '["Obtain fard from patwari","Pay stamp duty","Execute sale deed at sub-registrar","Register mutation"]'::jsonb,
  'Building2', false
)
on conflict (slug) do nothing;
