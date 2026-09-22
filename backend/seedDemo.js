import pool from './config.js';
import { hashPassword } from './passwords.js';

const demoAssets = [
  ['DEMO-LATHE-01', 'CNC Precision Lathe', 'Machining', 'Mecora VX-800', 'warning', 'online', 'Workshop Bay 1', 'SN-LAT-2021', 'Haas Automation', '2021-03-15', -14],
  ['DEMO-MILL-01', 'Vertical Milling Machine', 'Machining', 'Mecora MX-1200', 'active', 'online', 'Workshop Bay 1', 'SN-MIL-4091', 'DMG Mori', '2020-07-20', 7],
  ['DEMO-COMP-01', 'Workshop Air Compressor', 'Utilities', 'Comprax AC-750', 'maintenance', 'offline', 'Utility Room A', 'SN-CMP-1102', 'Atlas Copco', '2019-11-10', 0],
  ['DEMO-PUMP-01', 'Hydraulic Test Pump', 'Testing', 'Hydronix HP-800', 'active', 'online', 'Testing Lab', 'SN-PMP-8831', 'Bosch Rexroth', '2022-01-05', -45],
  ['DEMO-ROBOT-01', '6-Axis Articulated Robot', 'Robotics', 'Robexa AR-600', 'active', 'online', 'Assembly Cell 1', 'SN-ROB-9901', 'KUKA', '2023-02-18', 21],
  ['DEMO-ROBOT-02', 'Delta Pick & Place Robot', 'Robotics', 'Robexa DP-400', 'active', 'online', 'Packaging Line A', 'SN-ROB-9902', 'ABB', '2023-04-12', 35],
  ['DEMO-LASER-01', 'Fiber Laser Cutter 4kW', 'Fabrication', 'Novatek LC-4000', 'warning', 'online', 'Fabrication Hall', 'SN-LSR-5510', 'TRUMPF', '2022-06-30', -3],
  ['DEMO-BRAKE-01', 'CNC Press Brake 150T', 'Fabrication', 'Mechara PB-150', 'active', 'online', 'Fabrication Hall', 'SN-BRK-3320', 'Amada', '2021-09-14', 45],
  ['DEMO-CONV-01', 'Main Production Conveyor', 'Material Handling', 'Convega CV-1200', 'critical', 'offline', 'Central Bay', 'SN-CNV-0012', 'FlexLink', '2018-05-22', -1],
  ['DEMO-CONV-02', 'Packaging Sorter Conveyor', 'Material Handling', 'Convega PS-800', 'active', 'online', 'Packaging Line B', 'SN-CNV-0015', 'Interroll', '2021-12-01', 60],
  ['DEMO-INJ-01', 'Plastic Injection Molder 200T', 'Molding', 'Injectra IM-200', 'active', 'online', 'Molding Shop', 'SN-INJ-7711', 'Engel', '2020-10-10', 14],
  ['DEMO-INJ-02', 'Electric Injection Machine', 'Molding', 'Injectra EM-180', 'maintenance', 'offline', 'Molding Shop', 'SN-INJ-7712', 'Arburg', '2022-08-19', 2],
  ['DEMO-GEN-01', 'Emergency Diesel Generator 500kVA', 'Utilities', 'Genvora DG-500', 'active', 'unknown', 'Utility Yard', 'SN-GEN-6601', 'Cummins', '2019-04-05', 90],
  ['DEMO-CHILL-01', 'Industrial Water Chiller', 'Utilities', 'Chillonix WC-900', 'active', 'online', 'Utility Yard', 'SN-CHL-2201', 'Daikin', '2021-01-15', 18],
  ['DEMO-OVEN-01', 'Curing & Annealing Oven', 'Thermal Processing', 'Thermexa IO-800', 'active', 'online', 'Heat Treat Bay', 'SN-OVN-8812', 'Nabertherm', '2020-03-25', 28],
  ['DEMO-WELD-01', 'TIG Robotic Welding Cell', 'Fabrication', 'Ferrox W-400', 'active', 'online', 'Welding Shop', 'SN-WLD-4411', 'Fronius', '2022-11-08', 42],
  ['DEMO-WELD-02', 'MIG Automated Station', 'Fabrication', 'Ferrox W-600', 'offline', 'offline', 'Welding Shop', 'SN-WLD-4412', 'Lincoln Electric', '2021-05-19', -10],
  ['DEMO-CMM-01', 'Coordinate Measuring Machine', 'Quality Control', 'Metrixa CMM-500', 'active', 'online', 'Metrology Lab', 'SN-CMM-1001', 'Zeiss', '2023-01-10', 15],
  ['DEMO-OPT-01', '3D Optical Surface Scanner', 'Quality Control', 'Optivex OS-300', 'active', 'online', 'Metrology Lab', 'SN-OPT-2002', 'GOM', '2023-08-14', 50],
  ['DEMO-PRINT-01', 'Industrial SLA 3D Printer', 'Prototyping', 'Printara SLA-500', 'active', 'online', 'R&D Studio', 'SN-PRN-3011', 'Formlabs', '2022-09-01', 8],
  ['DEMO-PRINT-02', 'Metal Powder Bed Fusion 3D', 'Prototyping', 'Printara MP-900', 'warning', 'online', 'R&D Studio', 'SN-PRN-3012', 'EOS', '2023-03-11', -5],
  ['DEMO-PACK-01', 'Automated Case Erector', 'Packaging', 'Packora PE-700', 'active', 'online', 'Packaging Line A', 'SN-PCK-5011', 'Lantech', '2021-08-20', 30],
  ['DEMO-PACK-02', 'Pallet Wrapping Turntable', 'Packaging', 'Packora PW-600', 'active', 'online', 'Shipping Dock', 'SN-PCK-5012', 'Robopac', '2020-12-12', 75],
  ['DEMO-FORK-01', 'Electric Forklift 2.5T', 'Vehicles', 'Forka FT-250', 'active', 'online', 'Warehouse Bay', 'SN-FRK-9001', 'Jungheinrich', '2022-05-05', 12],
  ['DEMO-FORK-02', 'Reach Truck 1.6T', 'Vehicles', 'Forka RT-160', 'active', 'online', 'Warehouse Bay', 'SN-FRK-9002', 'Linde', '2021-10-30', 25],
  ['DEMO-CRANE-01', 'Overhead Gantry Crane 10T', 'Lifting', 'Cranex CG-1000', 'active', 'unknown', 'Heavy Fab Hall', 'SN-CRN-0001', 'Konecranes', '2017-02-14', 60],
  ['DEMO-DUST-01', 'Central Dust Extraction Unit', 'HVAC', 'Dustra DE-600', 'active', 'online', 'Roof Plant 1', 'SN-DST-1122', 'Nederman', '2020-04-18', 40],
  ['DEMO-FURN-01', 'Induction Melting Furnace', 'Foundry', 'Furnexa MF-1200', 'maintenance', 'offline', 'Foundry Area', 'SN-FRN-7001', 'Inductotherm', '2019-09-09', 1],
  ['DEMO-SAW-01', 'Automatic Bandsaw', 'Machining', 'Sawtek BS-700', 'active', 'online', 'Raw Material Store', 'SN-SAW-3310', 'Kasto', '2021-04-20', 22],
  ['DEMO-GRIND-01', 'Surface Grinding Machine', 'Machining', 'Grindora SG-500', 'active', 'online', 'Precision Toolroom', 'SN-GRD-5501', 'Studer', '2022-07-15', 33],
];

const demoSpareParts = [
  ['[Demo] Cutting Insert TNMG-1604', 'DEMO-INSERT-01', 'Mecora VX-800', 0, 'Carbide turning inserts - critical stockout'],
  ['[Demo] Hydraulic Filter Cartridge 10um', 'DEMO-FILTER-01', 'Hydronix HP-800', 3, 'High-pressure replacement filter element'],
  ['[Demo] Drive Belt SPZ-1250', 'DEMO-BELT-01', 'Comprax AC-750', 12, 'Reinforced rubber V-belt for drive assembly'],
  ['[Demo] Synthetic Coolant Concentrate 20L', 'DEMO-COOLANT-01', 'Mecora VX-800', 4, 'Water-miscible semi-synthetic cutting fluid'],
  ['[Demo] Polycarbonate Safety Guard', 'DEMO-GUARD-01', 'Mecora MX-1200', 25, 'Interlocked safety enclosure panel'],
  ['[Demo] Laser Lens Protective Window', 'DEMO-OPTIC-01', 'Novatek LC-4000', 2, 'Fused silica protective cover slide'],
  ['[Demo] Laser Nozzle Copper 1.5mm', 'DEMO-NOZZLE-01', 'Novatek LC-4000', 18, 'Single-layer chrome-plated cutting nozzle'],
  ['[Demo] Servo Motor 750W 3000RPM', 'DEMO-MTR-01', 'Convega CV-1200', 1, 'Brushless AC servo motor with brake'],
  ['[Demo] Photoelectric Sensor NPN', 'DEMO-SENS-01', 'Convega PS-800', 0, 'Infrared diffuse sensor 300mm range'],
  ['[Demo] Inductive Proximity Switch M12', 'DEMO-PROX-01', 'Mecora MX-1200', 14, 'Flush mount inductive switch IP67'],
  ['[Demo] Pneumatic Solenoid Valve 5/2', 'DEMO-VALV-01', 'Packora PE-700', 6, '24V DC pilot operated directional valve'],
  ['[Demo] Air Cylinder 50mm Bore 100mm Stroke', 'DEMO-CYL-01', 'Convega PS-800', 5, 'ISO 15552 double-acting cylinder'],
  ['[Demo] Linear Bearing Block HGH25CA', 'DEMO-BEAR-01', 'Mecora VX-800', 8, 'Heavy load linear motion ball bearing'],
  ['[Demo] Ball Screw Nut 3205', 'DEMO-BSCR-01', 'Grindora SG-500', 2, 'Preloaded precision ground ball nut'],
  ['[Demo] Oil Filter Spin-On Type', 'DEMO-OFIL-01', 'Comprax AC-750', 15, 'Compressor lubricant purification filter'],
  ['[Demo] Air Filter Element Poly', 'DEMO-AFIL-01', 'Dustra DE-600', 9, 'HEPA class pleated filter cartridge'],
  ['[Demo] Ceramic Heating Band 230V', 'DEMO-HEAT-01', 'Injectra IM-200', 3, 'Barrel heating element with thermocouple'],
  ['[Demo] Thermocouple Type K 2m', 'DEMO-TC-01', 'Thermexa IO-800', 11, 'Stainless steel sheathed probe sensor'],
  ['[Demo] TIG Torch Gas Lens Cup #8', 'DEMO-TIG-01', 'Ferrox W-400', 22, 'Alumina nozzle cup for argon shielding'],
  ['[Demo] Contact Tip 1.2mm CuCrZr', 'DEMO-MIG-01', 'Ferrox W-600', 45, 'Heavy-duty copper contact tip'],
  ['[Demo] Forklift Traction Battery Cell 2V', 'DEMO-BAT-01', 'Forka FT-250', 0, 'Lead-acid industrial traction element'],
  ['[Demo] Polyurethane Drive Wheel 250mm', 'DEMO-WHL-01', 'Forka FT-250', 4, 'Non-marking polyurethane load roller'],
  ['[Demo] SLA Resin Tough Clear 1L', 'DEMO-RSN-01', 'Printara SLA-500', 7, 'UV photopolymer resin cartridge'],
  ['[Demo] Metal Recoater Blade 300mm', 'DEMO-BLD-01', 'Printara MP-900', 2, 'Precision ceramic powder spreading blade'],
  ['[Demo] Wire Rope Hoist Cable 12mm', 'DEMO-CBL-01', 'Cranex CG-1000', 3, 'Galvanized steel non-rotating hoist wire'],
  ['[Demo] Bi-Metal Bandsaw Blade 4115mm', 'DEMO-SAWBL-01', 'Sawtek BS-700', 8, 'M42 variable pitch band saw strip'],
  ['[Demo] Diamond Grinding Wheel 200mm', 'DEMO-GRDW-01', 'Grindora SG-500', 1, 'Resin bonded cBN precision grinding wheel'],
  ['[Demo] Emergency Stop Pushbutton', 'DEMO-ESTOP-01', 'Ferrox W-400', 16, 'Twist-to-release 40mm mushroom button'],
  ['[Demo] Solid State Relay 40A 480V', 'DEMO-SSR-01', 'Thermexa IO-800', 10, 'Zero-crossing AC solid state switching relay'],
  ['[Demo] 24V DC Power Supply 10A DIN', 'DEMO-PSU-01', 'Convega CV-1200', 7, 'Regulated industrial switch-mode power unit'],
];

const demoMaintenancePlans = [
  ['DEMO-LATHE-01', 'Spindle alignment inspection', -14, 'planned', 'Alex Morgan', 450.0, 'Demo overdue maintenance - spindle runout check'],
  ['DEMO-MILL-01', 'Quarterly guideway lubrication & calibration', 7, 'planned', 'Jamie Lee', 320.0, 'Demo upcoming preventive maintenance'],
  ['DEMO-COMP-01', 'Emergency pressure valve seal replacement', 0, 'in_progress', 'Alex Morgan', 180.0, 'Demo maintenance due today'],
  ['DEMO-PUMP-01', 'Annual hydraulic calibration and oil test', -45, 'completed', 'Jamie Lee', 650.0, 'Demo completed calibration with ISO certification'],
  ['DEMO-ROBOT-01', 'Axis 1-6 gearbox backlash measurement', 21, 'planned', 'Sam Taylor', 800.0, 'Scheduled 5000-hour robot overhaul'],
  ['DEMO-ROBOT-02', 'Vacuum gripper hose & sensor harness refresh', -7, 'completed', 'Sam Taylor', 210.0, 'Replaced cracked suction tubing'],
  ['DEMO-LASER-01', 'Beam delivery optic cleaning and focus test', -3, 'planned', 'Chris Jordan', 550.0, 'Overdue protective window check'],
  ['DEMO-BRAKE-01', 'Hydraulic fluid filter replacement', 45, 'planned', 'Morgan Bailey', 290.0, 'Standard semi-annual servicing'],
  ['DEMO-CONV-01', 'Emergency roller bearing replacement', -1, 'in_progress', 'Alex Morgan', 920.0, 'Main line stalled due to seized bearing'],
  ['DEMO-CONV-02', 'Belt tensioning and optical sensor cleaning', 60, 'planned', 'Jamie Lee', 150.0, 'Routine inspection'],
  ['DEMO-INJ-01', 'Hydraulic clamp tonnage validation', 14, 'planned', 'Sam Taylor', 480.0, 'Scheduled process audit'],
  ['DEMO-INJ-02', 'Screw and barrel wear inspection', 2, 'planned', 'Sam Taylor', 750.0, 'High injection pressure variance reported'],
  ['DEMO-GEN-01', 'Diesel engine load bank test', 90, 'planned', 'Chris Jordan', 1200.0, 'Annual backup power readiness test'],
  ['DEMO-CHILL-01', 'Refrigerant pressure leak detection & top-up', 18, 'planned', 'Morgan Bailey', 360.0, 'Pre-summer thermal cycle preparation'],
  ['DEMO-OVEN-01', 'Heating element resistance & zone calibration', 28, 'planned', 'Jamie Lee', 420.0, 'Uniformity survey compliance check'],
  ['DEMO-WELD-01', 'Robotic torch TCP zero-point calibration', 42, 'planned', 'Sam Taylor', 260.0, 'Periodic seam tracking verification'],
  ['DEMO-WELD-02', 'Wire feeder motor assembly overhaul', -10, 'planned', 'Alex Morgan', 380.0, 'Overdue maintenance - motor stalls under load'],
  ['DEMO-CMM-01', 'Laser interferometer geometric verification', 15, 'planned', 'Elena Rostova', 1400.0, 'Traceable annual calibration certificate'],
  ['DEMO-PRINT-01', 'Galvo mirror alignment and tank leveling', 8, 'planned', 'Chris Jordan', 190.0, 'Resin vat optical path tune-up'],
  ['DEMO-PRINT-02', 'Laser power meter test and filter purge', -5, 'in_progress', 'Chris Jordan', 880.0, 'Low laser power alert investigation'],
  ['DEMO-PACK-01', 'Suction cup manifold replacement', 30, 'planned', 'Morgan Bailey', 240.0, 'Case erecting reliability improvement'],
  ['DEMO-FORK-01', 'Hydraulic mast inspection and chain test', 12, 'planned', 'Alex Morgan', 510.0, 'OSHA annual lifting equipment safety test'],
  ['DEMO-FORK-02', 'Brake pad replacement and tire rotation', 25, 'planned', 'Alex Morgan', 340.0, 'Warehouse fleet preventative service'],
  ['DEMO-CRANE-01', 'Wire rope magnetic induction testing', 60, 'planned', 'Elena Rostova', 950.0, 'Statutory heavy lifting proof test'],
  ['DEMO-DUST-01', 'Differential pressure sensor & damper tune', 40, 'planned', 'Morgan Bailey', 220.0, 'Explosion venting door inspection'],
  ['DEMO-FURN-01', 'Coil insulation resistance diagnostic', 1, 'in_progress', 'Sam Taylor', 1600.0, 'Ground fault safety trip investigation'],
  ['DEMO-SAW-01', 'Hydraulic downfeed valve refurbishment', 22, 'planned', 'Jamie Lee', 310.0, 'Cutting speed regulator rebuild'],
  ['DEMO-GRIND-01', 'Hydrostatic spindle oil flush and filter', 33, 'planned', 'Jamie Lee', 490.0, 'Fine surface finish preservation service'],
];

const demoUsers = [
  ['demo.admin', 'Demo Administrator', 'admin', true],
  ['demo.editor', 'Demo Lead Editor', 'editor', true],
  ['demo.viewer', 'Demo Facility Viewer', 'viewer', true],
  ['alex.morgan', 'Alex Morgan (Technician)', 'editor', true],
  ['jamie.lee', 'Jamie Lee (Technician)', 'editor', true],
  ['sam.taylor', 'Sam Taylor (Robotics Eng)', 'editor', true],
  ['chris.jordan', 'Chris Jordan (Optics Specialist)', 'editor', true],
  ['morgan.bailey', 'Morgan Bailey (Plant Mech)', 'editor', true],
  ['elena.rostova', 'Elena Rostova (Quality Mgr)', 'admin', true],
  ['sarah.connor', 'Sarah Connor (Safety Lead)', 'editor', true],
  ['marcus.vance', 'Marcus Vance (Production Sup)', 'editor', true],
  ['clara.oswald', 'Clara Oswald (Inventory Planner)', 'editor', true],
  ['david.tennant', 'David Tennant (Operations)', 'viewer', true],
  ['hannah.abbott', 'Hannah Abbott (Auditor)', 'viewer', true],
  ['oliver.queen', 'Oliver Queen (Procurement)', 'viewer', true],
  ['arthur.dent', 'Arthur Dent (Floor Assistant)', 'viewer', false],
  ['bruce.wayne', 'Bruce Wayne (Facility Owner)', 'admin', true],
  ['diana.prince', 'Diana Prince (Compliance)', 'admin', true],
  ['peter.parker', 'Peter Parker (Intern Tech)', 'viewer', true],
  ['tony.stark', 'Tony Stark (R&D Director)', 'admin', true],
  ['natasha.romanoff', 'Natasha Romanoff (Security)', 'editor', true],
  ['steve.rogers', 'Steve Rogers (Field Inspector)', 'editor', true],
  ['wanda.maximoff', 'Wanda Maximoff (Systems Analyst)', 'viewer', true],
  ['vision.ai', 'Vision (Automated Monitor)', 'viewer', true],
  ['inactive.contractor', 'Former Contractor', 'viewer', false],
];

async function seedDemo() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      DELETE FROM maintenance_records
      WHERE asset_id IN (SELECT id FROM assets WHERE asset_code LIKE 'DEMO-%')
    `);
    await client.query("DELETE FROM assets WHERE asset_code LIKE 'DEMO-%'");
    await client.query("DELETE FROM spare_parts WHERE name LIKE '[Demo] %'");
    await client.query("DELETE FROM users WHERE username LIKE 'demo.%' OR username LIKE 'demo_%' OR username IN (" +
      demoUsers.map((u) => `'${u[0]}'`).join(',') +
    ")");

    const assetIds = {};
    for (const [
      code,
      name,
      category,
      machineType,
      status,
      iotState,
      location,
      serialNumber,
      supplier,
      purchaseDate,
      maintenanceOffset
    ] of demoAssets) {
      const result = await client.query(
        `INSERT INTO assets (asset_code, name, category, machine_type, status, iot_state, location, serial_number, supplier, purchase_date, next_maintenance_date, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, (CURRENT_DATE + ($11 * INTERVAL '1 day'))::date, $12)
         RETURNING id`,
          [code, name, category, machineType, status, iotState, location, serialNumber, supplier, purchaseDate, maintenanceOffset, `Seeded demonstration asset: ${name}`]
      );
      assetIds[code] = result.rows[0].id;
    }

    for (const [name, partNum, machine, qty, desc] of demoSpareParts) {
      await client.query(
        `INSERT INTO spare_parts (name, manufacturer_number, compatible_machine_type, quantity_in_stock, description)
         VALUES ($1, $2, $3, $4, $5)`,
        [name, partNum, machine, qty, desc]
      );
    }

    const defaultPasswordHash = await hashPassword('demo123');
    const userMap = {};
    for (const [username, displayName, role, isActive] of demoUsers) {
      const userRes = await client.query(
        `INSERT INTO users (username, display_name, password_hash, role, is_active)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (username) DO UPDATE
         SET display_name = EXCLUDED.display_name,
             password_hash = EXCLUDED.password_hash,
             role = EXCLUDED.role,
             is_active = EXCLUDED.is_active
         RETURNING id, username, display_name`,
        [username, displayName, defaultPasswordHash, role, isActive]
      );
      const row = userRes.rows[0];
      userMap[displayName.toLowerCase()] = row;
      userMap[username.toLowerCase()] = row;
    }

    const findUser = (techName) => {
      if (!techName) return null;
      const lower = techName.toLowerCase();
      for (const [key, user] of Object.entries(userMap)) {
        if (key === lower || key.startsWith(lower) || key.includes(lower)) {
          return user;
        }
      }
      return null;
    };

    for (const [assetCode, maintType, dayOffset, status, tech, cost, notes] of demoMaintenancePlans) {
      const assetId = assetIds[assetCode];
      if (assetId) {
        const assignedUser = findUser(tech);
        await client.query(
          `INSERT INTO maintenance_records (asset_id, maintenance_type, scheduled_date, completed_date, status, technician, technician_id, cost, notes)
           VALUES (
             $1,
             $2,
             (CURRENT_DATE + ($3 * INTERVAL '1 day'))::date,
             CASE WHEN $4 = 'completed' THEN (CURRENT_DATE + (($3 + 1) * INTERVAL '1 day'))::date ELSE NULL END,
             $4,
             $5,
             $6,
             $7,
             $8
           )`,
          [
            assetId,
            maintType,
            dayOffset,
            status,
            assignedUser ? assignedUser.display_name : tech,
            assignedUser ? assignedUser.id : null,
            cost,
            notes,
          ]
        );
      }
    }

    await client.query('COMMIT');
    console.log(`Demo data successfully seeded: ${demoAssets.length} assets, ${demoSpareParts.length} spare parts, ${demoMaintenancePlans.length} maintenance records, ${demoUsers.length} users.`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to seed demo data:', error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDemo();
