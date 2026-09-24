import pool from '../config/database.js';
import { hashPassword } from '../utils/passwords.js';

const demoAssets = [
  ['CNC-LATHE-01', 'CNC Turning Center - Bar Line 1', 'CNC Machining', 'ST-30Y', 'warning', 'online', 'Machining Hall A', 'ST30Y-21-1048', 'Haas Automation', '2021-03-15', -14],
  ['CNC-LATHE-02', 'CNC Turning Center - Bar Line 2', 'CNC Machining', 'NLX 2500', 'active', 'online', 'Machining Hall A', 'NLX25-20-8831', 'DMG Mori', '2020-07-20', 18],
  ['CNC-LATHE-03', 'CNC Swiss-Type Lathe', 'CNC Machining', 'Cincom L32', 'active', 'online', 'Machining Hall A', 'L32-22-4410', 'Citizen Machinery', '2022-04-11', 31],

  ['CNC-MILL-01', '3-Axis Vertical Machining Center', 'CNC Machining', 'VF-4SS', 'active', 'online', 'Machining Hall B', 'VF4SS-19-4071', 'Haas Automation', '2019-09-03', 7],
  ['CNC-MILL-02', '5-Axis Machining Center', 'CNC Machining', 'DMU 50', 'active', 'online', 'Machining Hall B', 'DMU50-23-1904', 'DMG Mori', '2023-01-18', 45],
  ['CNC-MILL-03', 'Horizontal Machining Center', 'CNC Machining', 'NHX 4000', 'maintenance', 'offline', 'Machining Hall B', 'NHX4-18-2199', 'DMG Mori', '2018-11-28', 0],

  ['SAW-BAR-01', 'Automatic Steel Bar Bandsaw', 'Cutting', 'KASTOwin A 4.6', 'active', 'online', 'Raw Material Bay', 'KASTO-21-3310', 'KASTO', '2021-04-20', 22],
  ['SAW-TUBE-01', 'Automatic Tube & Profile Bandsaw', 'Cutting', 'HBE 411A', 'active', 'online', 'Raw Material Bay', 'BEHR-20-1127', 'Behringer', '2020-06-12', 40],
  ['SAW-COLD-01', 'Cold Saw for Precision Blanks', 'Cutting', 'CS-350 NC', 'warning', 'online', 'Raw Material Bay', 'CS350-19-5033', 'MEP', '2019-05-16', -4],

  ['BARFEED-01', 'Automatic Bar Feeder', 'Material Handling', 'Quick Load Servo 80', 'active', 'online', 'Machining Hall A', 'QL80-21-7780', 'LNS', '2021-03-15', 28],

  ['HEADER-01', 'Cold Header - Bolt Former 4 Die', 'Fastener Production', 'BF-4D-12', 'active', 'online', 'Fastener Hall', 'BF4D-20-1012', 'Sakamura', '2020-02-10', 12],
  ['HEADER-02', 'Cold Header - Bolt Former 5 Die', 'Fastener Production', 'BF-5D-16', 'warning', 'online', 'Fastener Hall', 'BF5D-19-2091', 'National Machinery', '2019-08-22', -6],
  ['NUTFORMER-01', 'Nut Former 6 Station', 'Fastener Production', 'NF-6S-M16', 'active', 'online', 'Fastener Hall', 'NF6S-22-3314', 'Chun Zu', '2022-02-14', 35],

  ['THREAD-ROLL-01', 'Flat-Die Thread Rolling Machine', 'Fastener Production', 'TR-25', 'active', 'online', 'Fastener Hall', 'TR25-21-6008', 'Seny', '2021-10-01', 14],
  ['THREAD-ROLL-02', 'Flat-Die Thread Rolling Machine', 'Fastener Production', 'TR-40', 'active', 'online', 'Fastener Hall', 'TR40-20-6011', 'Seny', '2020-12-09', 27],
  ['THREAD-ROLL-03', 'Planetary Thread Roller', 'Fastener Production', 'PTR-M20', 'maintenance', 'offline', 'Fastener Hall', 'PTR20-18-5120', 'E.W. Menn', '2018-05-30', 1],

  ['NUT-TAP-01', 'Automatic Nut Tapping Machine', 'Fastener Production', 'NTM-M16', 'active', 'online', 'Fastener Hall', 'NTM16-22-7104', 'San Shing', '2022-07-11', 19],
  ['NUT-TAP-02', 'Automatic Nut Tapping Machine', 'Fastener Production', 'NTM-M24', 'active', 'online', 'Fastener Hall', 'NTM24-21-7108', 'San Shing', '2021-09-02', 42],

  ['SORTER-01', 'Optical Bolt & Nut Sorting Machine', 'Quality Control', 'VISI-SORT 360', 'active', 'online', 'Inspection & Packing', 'VS360-23-9011', 'Dimac', '2023-05-04', 50],
  ['PACK-01', 'Automatic Fastener Counting & Bagging Line', 'Packaging', 'FCB-50', 'active', 'online', 'Inspection & Packing', 'FCB50-22-3044', 'WeighPack', '2022-08-18', 33],

  ['LASER-01', 'Fiber Laser Cutter 4 kW', 'Sheet Metal', 'TruLaser 3030 fiber', 'warning', 'online', 'Fabrication Hall', 'TL3030-22-5510', 'TRUMPF', '2022-06-30', -3],
  ['PRESSBRAKE-01', 'CNC Press Brake 170 t', 'Sheet Metal', 'HG 1703', 'active', 'online', 'Fabrication Hall', 'HG1703-21-3320', 'Amada', '2021-09-14', 45],
  ['PRESSBRAKE-02', 'CNC Press Brake 100 t', 'Sheet Metal', 'TruBend 3100', 'active', 'online', 'Fabrication Hall', 'TB3100-20-2910', 'TRUMPF', '2020-10-06', 62],

  ['WELD-ROBOT-01', 'Robotic MIG/MAG Welding Cell', 'Welding', 'KR CYBERTECH + TPS/i', 'active', 'online', 'Welding Bay', 'KUKA-22-4411', 'KUKA / Fronius', '2022-11-08', 42],
  ['WELD-MIG-01', 'Manual MIG/MAG Welding Station', 'Welding', 'Powertec i500S', 'active', 'online', 'Welding Bay', 'LE-21-4412', 'Lincoln Electric', '2021-05-19', 24],
  ['WELD-TIG-01', 'TIG Welding Station', 'Welding', 'MagicWave 3000', 'active', 'online', 'Welding Bay', 'FR-20-4480', 'Fronius', '2020-03-27', 56],

  ['GRINDER-CYL-01', 'CNC Cylindrical Grinder', 'Grinding', 'S33', 'active', 'online', 'Precision Finishing', 'S33-22-5501', 'Studer', '2022-07-15', 33],
  ['GRINDER-SURF-01', 'Surface Grinder', 'Grinding', 'PLANOMAT HP', 'active', 'online', 'Precision Finishing', 'PLAN-19-5508', 'Blohm', '2019-12-02', 26],

  ['DEBURR-01', 'Vibratory Deburring Machine', 'Finishing', 'R 420', 'active', 'online', 'Finishing Area', 'R420-20-1801', 'Rösler', '2020-05-21', 30],
  ['SHOTBLAST-01', 'Shot Blasting Cabinet', 'Finishing', 'RB-1000', 'active', 'online', 'Finishing Area', 'RB1000-19-1233', 'Rösler', '2019-03-18', 48],
  ['WASHER-01', 'Industrial Parts Washer', 'Finishing', 'EcoCwave', 'active', 'online', 'Finishing Area', 'ECW-21-9022', 'Ecoclean', '2021-11-09', 17],

  ['CMM-01', 'Coordinate Measuring Machine', 'Quality Control', 'CONTURA', 'active', 'online', 'Metrology Lab', 'CMM-23-1001', 'Zeiss', '2023-01-10', 15],
  ['OPTICAL-01', 'Optical Measurement System', 'Quality Control', 'SmartScope ZIP 300', 'active', 'online', 'Metrology Lab', 'OGP-23-2002', 'OGP', '2023-08-14', 50],
  ['HARDNESS-01', 'Rockwell Hardness Tester', 'Quality Control', 'DuraVision 250', 'active', 'online', 'Metrology Lab', 'DV250-21-7802', 'EMCO-TEST', '2021-06-18', 38],
  ['ROUGHNESS-01', 'Surface Roughness Tester', 'Quality Control', 'MarSurf PS 10', 'active', 'online', 'Metrology Lab', 'PS10-22-4821', 'Mahr', '2022-03-09', 44],
  ['TENSILE-01', 'Universal Tensile Testing Machine 100 kN', 'Quality Control', 'Z100', 'active', 'online', 'Material Lab', 'Z100-20-3901', 'ZwickRoell', '2020-09-25', 61],

  ['COMPRESSOR-01', 'Rotary Screw Air Compressor 75 kW', 'Utilities', 'GA 75 VSD+', 'maintenance', 'offline', 'Compressor Room', 'GA75-19-1102', 'Atlas Copco', '2019-11-10', 0],
  ['COMPRESSOR-02', 'Rotary Screw Air Compressor 55 kW', 'Utilities', 'BSD 75', 'active', 'online', 'Compressor Room', 'BSD75-21-1118', 'Kaeser', '2021-04-07', 55],
  ['AIR-DRYER-01', 'Compressed Air Refrigeration Dryer', 'Utilities', 'FD 185', 'active', 'online', 'Compressor Room', 'FD185-20-3318', 'Atlas Copco', '2020-08-19', 68],

  ['COOLANT-SYS-01', 'Central CNC Coolant Filtration System', 'Utilities', 'MicroMag MM-5000', 'active', 'online', 'Machining Hall A', 'MM5K-22-6630', 'Eclipse Magnetics', '2022-02-28', 23],
  ['MIST-EXTRACT-01', 'Central Oil Mist Extraction Unit', 'HVAC', 'Filtermist FX6000', 'active', 'online', 'Machining Hall A', 'FX6K-21-1122', 'Filtermist', '2021-04-18', 40],
  ['DUST-EXTRACT-01', 'Grinding Dust Extraction Unit', 'HVAC', 'S-1000', 'active', 'online', 'Precision Finishing', 'S1000-20-6614', 'Nederman', '2020-10-10', 37],

  ['CRANE-01', 'Overhead Bridge Crane 5 t', 'Material Handling', 'CXT 5T', 'active', 'online', 'Raw Material Bay', 'CXT5-18-0001', 'Konecranes', '2018-02-14', 60],
  ['CRANE-02', 'Jib Crane 1 t', 'Material Handling', 'ABUS LS 1T', 'active', 'unknown', 'Machining Hall B', 'LS1T-21-0088', 'ABUS', '2021-12-01', 75],

  ['FORKLIFT-01', 'Electric Forklift 3.0 t', 'Material Handling', 'E30', 'active', 'online', 'Warehouse', 'E30-22-9001', 'Linde', '2022-05-05', 12],
  ['REACH-TRUCK-01', 'Reach Truck 1.6 t', 'Material Handling', 'ETV 216i', 'active', 'online', 'Warehouse', 'ETV216-21-9002', 'Jungheinrich', '2021-10-30', 25],
];

const demoSpareParts = [
  ['CNMG 120408 Turning Insert - Steel Grade', 'INS-CNMG-120408', 'ST-30Y / NLX 2500', 120, 'Coated carbide insert for general steel roughing and finishing; ISO P25-P35.'],
  ['DNMG 150608 Turning Insert - Steel Grade', 'INS-DNMG-150608', 'ST-30Y / NLX 2500', 75, 'Negative turning insert for profiling alloy and carbon steels.'],

  ['ER32 Collet 12 mm', 'COL-ER32-12', 'VF-4SS / DMU 50', 14, 'Precision spring collet for drills, taps and end mills.'],
  ['ER32 Collet 16 mm', 'COL-ER32-16', 'VF-4SS / DMU 50', 11, 'Precision spring collet for drills, taps and end mills.'],

  ['Carbide End Mill 10 mm - 4 Flute', 'EM-CARB-10-4F', 'VF-4SS / DMU 50 / NHX 4000', 32, 'TiAlN-coated solid carbide end mill for steel machining.'],
  ['Carbide Drill 8.5 mm', 'DRILL-CARB-8.5', 'VF-4SS / DMU 50 / NHX 4000', 24, 'Through-coolant carbide drill for production drilling.'],

  ['Machine Tap M8 x 1.25', 'TAP-M8-125', 'VF-4SS / DMU 50', 20, 'Spiral-point HSS-E production tap for steel.'],
  ['Machine Tap M12 x 1.75', 'TAP-M12-175', 'VF-4SS / DMU 50', 16, 'Spiral-point HSS-E production tap for steel.'],

  ['Semi-Synthetic CNC Coolant - 20L', 'COOLANT-SS-20L', 'CNC Machining', 18, 'Water-miscible machining coolant concentrate for steel and stainless steel.'],

  ['M42 Bandsaw Blade 41 x 1.3 mm - 4/6 TPI', 'BLADE-M42-416', 'KASTOwin A 4.6', 10, 'Bi-metal blade for solid carbon and alloy steel bar.'],
  ['M42 Bandsaw Blade 34 x 1.1 mm - 5/7 TPI', 'BLADE-M42-347', 'HBE 411A', 12, 'Bi-metal blade for steel tube and profile stock.'],

  ['Cold Heading Punch - M10 Hex Bolt', 'HEAD-PUNCH-M10', 'BF-4D-12', 6, 'Forming punch for M10 hex-head carbon steel bolt production.'],
  ['Cold Heading Die - M10 Shank', 'HEAD-DIE-M10', 'BF-4D-12', 5, 'Carbide heading die for M10 bolt shank forming.'],
  ['Cold Heading Punch - M16 Hex Bolt', 'HEAD-PUNCH-M16', 'BF-5D-16', 4, 'Forming punch for M16 alloy steel bolt production.'],

  ['Nut Former Die Insert - M12', 'NUT-DIE-M12', 'NF-6S-M16', 8, 'Carbide die insert for six-station nut forming.'],

  ['Thread Rolling Die Set - M8 x 1.25', 'ROLL-DIE-M8', 'TR-25', 7, 'Matched flat-die set for ISO metric M8 threads.'],
  ['Thread Rolling Die Set - M10 x 1.5', 'ROLL-DIE-M10', 'TR-25', 5, 'Matched flat-die set for ISO metric M10 threads.'],
  ['Thread Rolling Die Set - M16 x 2.0', 'ROLL-DIE-M16', 'TR-40', 4, 'Matched flat-die set for ISO metric M16 threads.'],

  ['Nut Tap M8 x 1.25 - Long Shank', 'NUT-TAP-M8', 'NTM-M16', 18, 'Long-shank nut tap for automatic steel nut production.'],
  ['Nut Tap M12 x 1.75 - Long Shank', 'NUT-TAP-M12', 'NTM-M16', 14, 'Long-shank nut tap for automatic steel nut production.'],
  ['Nut Tap M20 x 2.5 - Long Shank', 'NUT-TAP-M20', 'NTM-M24', 8, 'Long-shank nut tap for large steel nut production.'],

  ['Fiber Laser Protective Window', 'LASER-WINDOW-01', 'TruLaser 3030 fiber', 6, 'Protective cover window for fiber laser cutting head.'],
  ['Fiber Laser Nozzle 1.2 mm', 'LASER-NOZ-1.2', 'TruLaser 3030 fiber', 24, 'Copper cutting nozzle for thin steel sheet.'],
  ['Fiber Laser Nozzle 2.0 mm', 'LASER-NOZ-2.0', 'TruLaser 3030 fiber', 18, 'Copper nozzle for medium-thickness steel.'],

  ['MIG Contact Tip 1.0 mm CuCrZr', 'MIG-TIP-1.0', 'Powertec i500S / TPS/i', 80, 'Heavy-duty contact tip for steel welding wire.'],
  ['MIG Contact Tip 1.2 mm CuCrZr', 'MIG-TIP-1.2', 'Powertec i500S / TPS/i', 65, 'Heavy-duty contact tip for structural steel welding.'],

  ['CBN Grinding Wheel 400 mm', 'GRIND-CBN-400', 'S33', 2, 'CBN wheel for hardened steel cylindrical grinding.'],
  ['Surface Grinding Wheel 300 mm', 'GRIND-SURF-300', 'PLANOMAT HP', 4, 'Aluminum oxide grinding wheel for steel.'],

  ['CMM Stylus 3 mm Ruby', 'CMM-STYLUS-3', 'CONTURA', 6, 'Ruby ball stylus for dimensional inspection.'],
  ['CMM Stylus 5 mm Ruby', 'CMM-STYLUS-5', 'CONTURA', 4, 'Ruby ball stylus for bores and larger steel components.'],

  ['Compressor Oil Filter', 'COMP-OIL-FILTER', 'GA 75 VSD+ / BSD 75', 8, 'Lubricant filter for rotary screw compressors.'],
  ['Compressor Air Intake Filter', 'COMP-AIR-FILTER', 'GA 75 VSD+ / BSD 75', 8, 'Air intake filter for rotary screw compressors.'],
  ['Compressor Separator Element', 'COMP-SEPARATOR', 'GA 75 VSD+ / BSD 75', 3, 'Air/oil separator cartridge.'],

  ['Oil Mist Filter Cartridge', 'MIST-FILTER-FX6000', 'Filtermist FX6000', 10, 'High-efficiency CNC oil mist filter element.'],
  ['Grinding Dust Filter Cartridge', 'DUST-FILTER-S1000', 'S-1000', 12, 'Filter cartridge for steel grinding dust extraction.'],

  ['Crane Wire Rope 10 mm', 'CRANE-ROPE-10', 'CXT 5T', 2, 'Steel wire rope for bridge crane hoist.'],
  ['Forklift Hydraulic Filter', 'FORK-HYD-FILTER', 'E30 / ETV 216i', 6, 'Hydraulic filter element for warehouse vehicles.'],
];

const demoMaintenancePlans = [
  ['CNC-LATHE-01', 'Spindle runout, turret alignment and chuck inspection', -14, 'planned', 'Alex Morgan', 620.0, 'Overdue after finish-diameter drift on precision turned steel parts.'],
  ['CNC-LATHE-02', 'Guideway lubrication and bar feeder synchronization', 18, 'planned', 'Jamie Lee', 390.0, 'Quarterly preventive service for bar-fed production.'],
  ['CNC-LATHE-03', 'Guide bushing, sub-spindle and coolant pressure inspection', 31, 'planned', 'Alex Morgan', 470.0, 'Scheduled inspection for small turned fastener components.'],

  ['CNC-MILL-01', 'Ballbar test, tool changer inspection and lubrication service', 7, 'planned', 'Jamie Lee', 520.0, 'Quarterly geometry and automatic tool changer inspection.'],
  ['CNC-MILL-02', '5-axis kinematic calibration and spindle condition check', 45, 'planned', 'Elena Rostova', 1450.0, 'Annual accuracy verification for complex machined steel components.'],
  ['CNC-MILL-03', 'Pallet changer hydraulic fault repair', 0, 'in_progress', 'Alex Morgan', 980.0, 'Machine stopped after pallet clamp pressure alarm.'],

  ['SAW-BAR-01', 'Blade guide, hydraulic downfeed and coolant inspection', 22, 'planned', 'Jamie Lee', 310.0, 'Preventive maintenance for production steel bar cutting.'],
  ['SAW-TUBE-01', 'Blade tension calibration and chip brush replacement', 40, 'planned', 'Jamie Lee', 280.0, 'Routine tube and profile saw service.'],
  ['SAW-COLD-01', 'Cold saw spindle bearing inspection', -4, 'planned', 'Alex Morgan', 360.0, 'Overdue due to increased vibration during precision blank cutting.'],
  ['BARFEED-01', 'Magazine chain tension and pusher alignment', 28, 'planned', 'Alex Morgan', 240.0, 'Routine bar feeder alignment and lubrication service.'],

  ['HEADER-01', 'Heading ram guide and transfer timing inspection', 12, 'planned', 'Marcus Vance', 680.0, 'Preventive inspection after high-volume M10 bolt production.'],
  ['HEADER-02', 'Cut-off station alignment and die pocket inspection', -6, 'planned', 'Marcus Vance', 740.0, 'Overdue after increased scrap caused by inconsistent blank length.'],
  ['NUTFORMER-01', 'Nut former transfer finger and knockout inspection', 35, 'planned', 'Marcus Vance', 610.0, 'Scheduled multi-station nut former service.'],

  ['THREAD-ROLL-01', 'Thread die alignment and feed rail inspection', 14, 'planned', 'Alex Morgan', 330.0, 'Routine M8 and M10 thread rolling quality maintenance.'],
  ['THREAD-ROLL-02', 'Thread rolling slide lubrication and die holder inspection', 27, 'planned', 'Alex Morgan', 350.0, 'Preventive service before next M16 production batch.'],
  ['THREAD-ROLL-03', 'Planetary die carrier bearing replacement', 1, 'in_progress', 'Jamie Lee', 880.0, 'Bearing noise detected during M20 thread rolling.'],

  ['NUT-TAP-01', 'Tap spindle backlash and coolant nozzle inspection', 19, 'planned', 'Jamie Lee', 290.0, 'Preventive service for automatic nut tapping line.'],
  ['NUT-TAP-02', 'Feed bowl alignment and tapping torque calibration', 42, 'planned', 'Jamie Lee', 340.0, 'Scheduled large-nut tapping line inspection.'],

  ['SORTER-01', 'Camera lens cleaning and dimensional master verification', 50, 'planned', 'Elena Rostova', 460.0, 'Optical sorting system verification using certified master fasteners.'],
  ['PACK-01', 'Counting sensor calibration and sealing jaw inspection', 33, 'planned', 'Clara Oswald', 220.0, 'Preventive inspection for fastener counting and bagging line.'],

  ['LASER-01', 'Cutting head optic cleaning, nozzle centering and focus test', -3, 'planned', 'Chris Jordan', 550.0, 'Overdue protective window and cutting focus inspection.'],

  ['PRESSBRAKE-01', 'Backgauge accuracy, ram parallelism and hydraulic filter check', 45, 'planned', 'Jamie Lee', 470.0, 'Semi-annual bending accuracy maintenance.'],
  ['PRESSBRAKE-02', 'Tool clamping system and crowning calibration', 62, 'planned', 'Jamie Lee', 510.0, 'Scheduled press brake calibration.'],

  ['WELD-ROBOT-01', 'Robot TCP calibration, wire feed inspection and torch service', 42, 'planned', 'Sam Taylor', 380.0, 'Periodic seam tracking and torch center point verification.'],
  ['WELD-MIG-01', 'Wire feeder liner and drive roll service', 24, 'planned', 'Sam Taylor', 190.0, 'Preventive MIG/MAG feeder maintenance.'],
  ['WELD-TIG-01', 'Cooling circuit and TIG torch inspection', 56, 'planned', 'Sam Taylor', 180.0, 'Routine water-cooled TIG station maintenance.'],

  ['GRINDER-CYL-01', 'Grinding spindle vibration test and dresser inspection', 33, 'planned', 'Jamie Lee', 620.0, 'Required to maintain dimensional accuracy and surface finish on hardened shafts.'],
  ['GRINDER-SURF-01', 'Table geometry, magnetic chuck and lubrication inspection', 26, 'planned', 'Jamie Lee', 440.0, 'Preventive surface grinder service.'],

  ['DEBURR-01', 'Bowl lining inspection and vibration motor check', 30, 'planned', 'Morgan Bailey', 260.0, 'Routine vibratory finishing machine inspection.'],
  ['SHOTBLAST-01', 'Blast nozzle, dust seal and media separator inspection', 48, 'planned', 'Morgan Bailey', 310.0, 'Shot blasting system reliability service.'],
  ['WASHER-01', 'Pump, filter and bath concentration inspection', 17, 'planned', 'Morgan Bailey', 250.0, 'Parts washer process check for reliable oil and chip removal.'],

  ['CMM-01', 'Traceable geometric calibration', 15, 'planned', 'Elena Rostova', 1400.0, 'Annual dimensional inspection system calibration.'],
  ['OPTICAL-01', 'Optical scale and camera calibration', 50, 'planned', 'Elena Rostova', 980.0, 'Scheduled optical measurement system verification.'],
  ['HARDNESS-01', 'Force, indenter and reference block verification', 38, 'planned', 'Elena Rostova', 520.0, 'Rockwell hardness tester calibration.'],
  ['ROUGHNESS-01', 'Stylus condition and roughness standard verification', 44, 'planned', 'Elena Rostova', 260.0, 'Surface roughness tester verification.'],
  ['TENSILE-01', 'Load cell and extensometer calibration', 61, 'planned', 'Elena Rostova', 1250.0, 'Annual tensile tester calibration for material certification work.'],

  ['COMPRESSOR-01', 'Separator element, oil filter and coupling inspection', 0, 'in_progress', 'Morgan Bailey', 860.0, 'Compressor offline for scheduled 8,000-hour service.'],
  ['COMPRESSOR-02', 'Air intake filter and condensate drain service', 55, 'planned', 'Morgan Bailey', 390.0, 'Quarterly compressed air system service.'],
  ['AIR-DRYER-01', 'Condenser cleaning and dew point check', 68, 'planned', 'Morgan Bailey', 280.0, 'Maintain dry compressed air for CNC and pneumatic equipment.'],

  ['COOLANT-SYS-01', 'Magnetic separator cleanout and pump inspection', 23, 'planned', 'Morgan Bailey', 340.0, 'Central CNC coolant filtration preventive maintenance.'],
  ['MIST-EXTRACT-01', 'Filter cartridge inspection and airflow measurement', 40, 'planned', 'Morgan Bailey', 220.0, 'Oil mist extraction performance inspection.'],
  ['DUST-EXTRACT-01', 'Filter differential pressure and spark trap inspection', 37, 'planned', 'Morgan Bailey', 260.0, 'Grinding dust extraction system maintenance.'],

  ['CRANE-01', 'Wire rope, hook block, brake and limit switch inspection', 60, 'planned', 'Steve Rogers', 920.0, 'Periodic lifting equipment inspection for steel stock handling.'],
  ['CRANE-02', 'Slew bearing, hoist brake and pendant inspection', 75, 'planned', 'Steve Rogers', 420.0, 'Jib crane preventive maintenance.'],

  ['FORKLIFT-01', 'Mast chains, forks, brakes and hydraulic system inspection', 12, 'planned', 'Alex Morgan', 510.0, 'Warehouse lifting equipment service.'],
  ['REACH-TRUCK-01', 'Reach mast rollers, traction battery and brake inspection', 25, 'planned', 'Alex Morgan', 460.0, 'Preventive service for warehouse reach truck.'],
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
