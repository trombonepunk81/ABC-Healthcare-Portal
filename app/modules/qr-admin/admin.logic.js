<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ABC Healthcare QR Code Generator</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
    <style>
        :root {
            --slate-900: #0f172a;
            --slate-800: #1e293b;
            --slate-700: #334155;
            --slate-600: #475569;
            --slate-400: #94a3b8;
            --slate-200: #e2e8f0;
            --slate-100: #f1f5f9;
            --teal-600: #0d9488;
            --teal-500: #14b8a6;
            --teal-400: #2dd4bf;
            --white: #ffffff;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; background: var(--slate-100); min-height: 100vh; }
        .header { background: linear-gradient(135deg, var(--slate-900), var(--slate-700)); padding: 2.5rem 2rem 3.5rem; text-align: center; position: relative; overflow: hidden; }
        .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(ellipse 80% 50% at 20% 40%, rgba(20, 184, 166, 0.15) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(245, 158, 11, 0.1) 0%, transparent 50%); pointer-events: none; }
        .header > * { position: relative; z-index: 1; }
        .logo-badge { display: inline-block; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 0.5rem 1rem; border-radius: 50px; margin-bottom: 1rem; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--teal-400); border: 1px solid rgba(255, 255, 255, 0.1); }
        h1 { font-family: 'Instrument Serif', serif; font-size: 2.5rem; color: white; margin-bottom: 0.5rem; }
        .subtitle { color: var(--slate-400); }
        .main-content { max-width: 1000px; margin: -2rem auto 3rem; padding: 0 1.5rem; }
        .card { background: white; border-radius: 20px; box-shadow: 0 16px 48px -12px rgba(15,23,42,0.25); padding: 2rem; }
        .status-bar { padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.85rem; }
        .status-bar.success { background: #dcfce7; color: #166534; }
        .status-bar.error { background: #fef2f2; color: #dc2626; }
        .status-bar.loading { background: #fef3c7; color: #92400e; }
        .status-bar.info { background: #dbeafe; color: #1e40af; }
        .tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
        .tab { padding: 0.625rem 1.25rem; border: 1px solid var(--slate-200); border-radius: 8px; background: white; cursor: pointer; font-family: inherit; font-size: 0.9rem; transition: all 0.2s; }
        .tab.active { background: var(--slate-800); color: white; border-color: var(--slate-800); }
        .tab.disabled { opacity: 0.5; cursor: not-allowed; }
        .tab-content { display: none; }
        .tab-content.active { display: block; animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .form-group { margin-bottom: 1.25rem; }
        .form-label { display: block; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; color: var(--slate-600); margin-bottom: 0.5rem; letter-spacing: 0.05em; }
        .form-input, .batch-textarea { width: 100%; padding: 0.875rem 1rem; border: 1px solid var(--slate-200); border-radius: 10px; font-family: inherit; font-size: 0.95rem; transition: border 0.2s; }
        .form-input:focus, .batch-textarea:focus { outline: none; border-color: var(--teal-400); }
        .batch-textarea { min-height: 150px; font-family: monospace; font-size: 0.85rem; }
        .generate-btn { display: block; width: 100%; padding: 1rem; border: none; border-radius: 12px; background: linear-gradient(135deg, var(--teal-600), var(--teal-500)); color: white; font-size: 1rem; font-weight: 600; cursor: pointer; transition: transform 0.2s; }
        .generate-btn:hover { transform: translateY(-1px); }
        .generate-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .import-section { display: flex; gap: 0.75rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
        .import-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; border: 2px dashed var(--teal-400); border-radius: 10px; background: rgba(20,184,166,0.05); color: var(--teal-600); font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .import-btn:hover { background: rgba(20,184,166,0.1); }
        .template-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; border: 1px solid var(--slate-200); border-radius: 10px; background: white; color: var(--slate-600); cursor: pointer; transition: all 0.2s; font-family: inherit; font-size: 0.9rem; }
        .template-btn:hover { background: var(--slate-100); }
        .output-section { display: none; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--slate-200); }
        .output-section.active { display: block; }
        .qr-preview { background: white; border: 1px solid var(--slate-200); border-radius: 16px; padding: 1.5rem; text-align: center; display: inline-block; }
        .qr-preview canvas, .qr-preview img { display: block; margin: 0 auto; }
        .qr-asset-label { margin-top: 1rem; font-size: 1.1rem; font-weight: 700; }
        .batch-results { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem; }
        .batch-item { background: white; border: 1px solid var(--slate-200); border-radius: 12px; padding: 1rem; text-align: center; }
        .batch-item canvas { display: block; margin: 0 auto; }
        .batch-item-label { margin-top: 0.75rem; font-size: 0.85rem; font-weight: 600; }
        .batch-item-download { margin-top: 0.5rem; padding: 0.5rem 0.75rem; border: none; border-radius: 6px; background: var(--slate-100); cursor: pointer; font-size: 0.75rem; }
        .download-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; border: none; border-radius: 10px; background: var(--slate-800); color: white; cursor: pointer; margin-right: 0.5rem; margin-bottom: 0.5rem; transition: all 0.2s; font-family: inherit; font-size: 0.9rem; }
        .download-btn:hover { background: var(--slate-700); }
        .download-btn.pdf { background: #dc2626; }
        .download-btn.pdf:hover { background: #b91c1c; }
        .footer { text-align: center; padding: 2rem; color: var(--slate-400); font-size: 0.8rem; }
        .footer a { color: var(--slate-400); text-decoration: none; }
        .footer a:hover { color: var(--teal-400); }
        
        /* Tandem Connect Styles */
        .connect-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.875rem 1.5rem; border: none; border-radius: 10px; background: linear-gradient(135deg, var(--teal-600), var(--teal-500)); color: white; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .connect-btn:hover { transform: translateY(-1px); }
        .connect-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .asset-list { max-height: 400px; overflow-y: auto; border: 1px solid var(--slate-200); border-radius: 10px; margin-bottom: 1rem; }
        .asset-item { padding: 1rem; border-bottom: 1px solid var(--slate-200); cursor: pointer; transition: background 0.2s; }
        .asset-item:hover { background: var(--slate-100); }
        .asset-item:last-child { border-bottom: none; }
        .asset-item.selected { background: rgba(20, 184, 166, 0.1); border-left: 3px solid var(--teal-500); }
        .asset-item.hidden { display: none; }
        .asset-item-name { font-weight: 600; color: var(--slate-800); margin-bottom: 0.25rem; }
        .asset-item-meta { font-size: 0.8rem; color: var(--slate-500); margin-top: 0.35rem; display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .asset-item-meta span { background: var(--slate-100); padding: 0.15rem 0.5rem; border-radius: 4px; }
        .asset-item-meta .category-tag { background: rgba(20, 184, 166, 0.15); color: var(--teal-600); }
        .selected-count { display: inline-block; background: var(--teal-500); color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem; font-weight: 600; margin-right: 1rem; }
        .loading-spinner { display: inline-block; width: 20px; height: 20px; border: 3px solid var(--slate-200); border-top-color: var(--teal-500); border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .info-banner { background: rgba(20, 184, 166, 0.05); border-left: 3px solid var(--teal-500); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; color: var(--slate-700); font-size: 0.9rem; }

        /* Excel-style Filter Dropdowns */
        .filter-bar {
            display: flex;
            gap: 0.75rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
            align-items: flex-start;
        }
        .filter-dropdown {
            position: relative;
            display: inline-block;
        }
        .filter-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.625rem 1rem;
            border: 1px solid var(--slate-200);
            border-radius: 8px;
            background: white;
            color: var(--slate-700);
            cursor: pointer;
            font-size: 0.85rem;
            font-family: inherit;
            transition: all 0.2s;
            min-width: 140px;
            justify-content: space-between;
        }
        .filter-btn:hover { border-color: var(--teal-400); }
        .filter-btn.active { border-color: var(--teal-500); background: rgba(20, 184, 166, 0.05); }
        .filter-btn .arrow { font-size: 0.7rem; transition: transform 0.2s; }
        .filter-btn.open .arrow { transform: rotate(180deg); }
        .filter-badge {
            background: var(--teal-500);
            color: white;
            font-size: 0.7rem;
            padding: 0.1rem 0.4rem;
            border-radius: 10px;
            margin-left: 0.25rem;
        }
        .filter-panel {
            position: absolute;
            top: 100%;
            left: 0;
            margin-top: 4px;
            background: white;
            border: 1px solid var(--slate-200);
            border-radius: 10px;
            box-shadow: 0 10px 40px -10px rgba(15,23,42,0.3);
            z-index: 100;
            min-width: 240px;
            max-width: 300px;
            display: none;
        }
        .filter-panel.open { display: block; }
        .filter-search {
            width: 100%;
            padding: 0.625rem 0.875rem;
            border: none;
            border-bottom: 1px solid var(--slate-200);
            font-size: 0.85rem;
            font-family: inherit;
            border-radius: 10px 10px 0 0;
        }
        .filter-search:focus { outline: none; background: var(--slate-100); }
        .filter-actions {
            display: flex;
            gap: 0.5rem;
            padding: 0.5rem 0.75rem;
            border-bottom: 1px solid var(--slate-200);
            background: var(--slate-100);
        }
        .filter-action-btn {
            padding: 0.35rem 0.6rem;
            border: none;
            border-radius: 4px;
            background: white;
            color: var(--slate-600);
            font-size: 0.75rem;
            cursor: pointer;
            font-family: inherit;
        }
        .filter-action-btn:hover { background: var(--teal-500); color: white; }
        .filter-options {
            max-height: 250px;
            overflow-y: auto;
            padding: 0.5rem 0;
        }
        .filter-option {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 0.875rem;
            cursor: pointer;
            font-size: 0.85rem;
            transition: background 0.15s;
        }
        .filter-option:hover { background: var(--slate-100); }
        .filter-option.hidden { display: none; }
        .filter-option input[type="checkbox"] {
            width: 16px;
            height: 16px;
            accent-color: var(--teal-500);
            cursor: pointer;
        }
        .filter-option-label {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .filter-option-count {
            font-size: 0.75rem;
            color: var(--slate-400);
            background: var(--slate-100);
            padding: 0.1rem 0.4rem;
            border-radius: 4px;
        }
        .clear-filters-btn {
            padding: 0.625rem 1rem;
            border: 1px solid var(--slate-200);
            border-radius: 8px;
            background: white;
            color: var(--slate-600);
            cursor: pointer;
            font-size: 0.85rem;
            font-family: inherit;
        }
        .clear-filters-btn:hover { background: var(--slate-100); }
        
        .filter-summary {
            font-size: 0.8rem;
            color: var(--slate-500);
            margin-bottom: 0.75rem;
        }
        
        .selection-bar {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
            align-items: center;
        }
        
        /* Download options */
        .download-options {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--slate-200);
        }
        
        /* PDF Grid Options */
        .pdf-options {
            display: none;
            background: var(--slate-100);
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 1rem;
        }
        .pdf-options.active { display: block; }
        .pdf-options label {
            font-size: 0.85rem;
            color: var(--slate-600);
            margin-right: 0.5rem;
        }
        .pdf-options select {
            padding: 0.5rem;
            border: 1px solid var(--slate-200);
            border-radius: 6px;
            font-family: inherit;
            margin-right: 1rem;
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="logo-badge">🔧 Admin Tools</div>
        <h1>QR Code Generator</h1>
        <p class="subtitle">Generate asset QR codes for the Help Center portal</p>
    </header>

    <main class="main-content">
        <div class="card">
            <div id="status-bar" class="status-bar loading">Loading QR library...</div>
            
            <div class="tabs">
                <button class="tab active" onclick="switchTab('single')">Single QR Code</button>
                <button class="tab" onclick="switchTab('batch')">Batch Generate</button>
                <button class="tab" onclick="switchTab('tandem')">🔗 Tandem Connect</button>
            </div>

            <!-- SINGLE QR TAB -->
            <div id="single-tab" class="tab-content active">
                <div class="form-group">
                    <label class="form-label">Asset ID</label>
                    <input type="text" id="asset-id" class="form-input" placeholder="e.g., CAM.E1879.01">
                </div>
                <div class="form-group">
                    <label class="form-label">Tandem URL</label>
                    <input type="text" id="tandem-url" class="form-input" placeholder="https://tandem.autodesk.com/...">
                </div>
                <button class="generate-btn" id="single-gen-btn" onclick="generateSingleQR()" disabled>Generate QR Code</button>
                <div id="single-output" class="output-section">
                    <div class="qr-preview">
                        <div id="qr-container"></div>
                        <div class="qr-asset-label" id="qr-asset-label"></div>
                    </div>
                    <p style="margin-top:1rem; color: var(--slate-500); word-break: break-all; font-size: 0.8rem;" id="qr-full-url"></p>
                    <button class="download-btn" onclick="downloadSingleQR()">📥 Download PNG</button>
                </div>
            </div>

            <!-- BATCH QR TAB -->
            <div id="batch-tab" class="tab-content">
                <div class="import-section">
                    <button class="import-btn" onclick="document.getElementById('excel-file').click()">📊 Import Excel</button>
                    <input type="file" id="excel-file" accept=".xlsx,.xls" style="display:none" onchange="importExcel(event)">
                    <button class="template-btn" onclick="downloadTemplate()">⬇️ Download Template</button>
                </div>
                <div class="form-group">
                    <label class="form-label">Asset Data (one per line: AssetID, TandemURL)</label>
                    <textarea id="batch-data" class="batch-textarea" placeholder="CAM.E1879.01, https://tandem.autodesk.com/...&#10;AHU.B2301.05, https://tandem.autodesk.com/..."></textarea>
                </div>
                <button class="generate-btn" id="batch-gen-btn" onclick="generateBatchQR()" disabled>Generate All QR Codes</button>
                <div id="batch-output" class="output-section">
                    <div class="download-options">
                        <button class="download-btn" onclick="downloadAllZip()">📦 Download ZIP</button>
                        <button class="download-btn pdf" onclick="downloadPDF()">📄 Download PDF Grid</button>
                    </div>
                    <div class="pdf-options" id="batch-pdf-options">
                        <label>Grid Size:</label>
                        <select id="batch-grid-size">
                            <option value="2x4">2 × 4 (8 per page)</option>
                            <option value="3x5" selected>3 × 5 (15 per page)</option>
                            <option value="4x6">4 × 6 (24 per page)</option>
                        </select>
                        <button class="template-btn" onclick="generatePDF('batch')">Generate PDF</button>
                    </div>
                    <div id="batch-results" class="batch-results"></div>
                </div>
            </div>

            <!-- TANDEM CONNECT TAB -->
            <div id="tandem-tab-content" class="tab-content">
                <div class="info-banner">
                    🔗 Load assets directly from Tandem Connect pipeline data (auto-synced daily)
                </div>
                
                <button class="connect-btn" id="load-tandem-btn" onclick="loadTandemAssets()">
                    <span class="loading-spinner" style="display:none;" id="tandem-spinner"></span>
                    <span id="tandem-btn-text">Load Assets from Tandem</span>
                </button>
                
                <div id="tandem-status" style="margin-top: 1rem; display: none;"></div>
                
                <div id="tandem-loaded" style="display:none;">
                    
                    <!-- Filter Bar -->
                    <div class="filter-bar" id="filter-bar">
                        <!-- Category Filter -->
                        <div class="filter-dropdown" id="filter-category">
                            <button class="filter-btn" onclick="toggleFilterPanel('category')">
                                <span>Category</span>
                                <span class="filter-badge" id="category-badge" style="display:none;">0</span>
                                <span class="arrow">▼</span>
                            </button>
                            <div class="filter-panel" id="category-panel">
                                <input type="text" class="filter-search" placeholder="Search categories..." oninput="searchFilterOptions('category', this.value)">
                                <div class="filter-actions">
                                    <button class="filter-action-btn" onclick="selectAllFilterOptions('category')">Select All</button>
                                    <button class="filter-action-btn" onclick="deselectAllFilterOptions('category')">Clear</button>
                                </div>
                                <div class="filter-options" id="category-options"></div>
                            </div>
                        </div>
                        
                        <!-- Level Filter -->
                        <div class="filter-dropdown" id="filter-level">
                            <button class="filter-btn" onclick="toggleFilterPanel('level')">
                                <span>Level</span>
                                <span class="filter-badge" id="level-badge" style="display:none;">0</span>
                                <span class="arrow">▼</span>
                            </button>
                            <div class="filter-panel" id="level-panel">
                                <input type="text" class="filter-search" placeholder="Search levels..." oninput="searchFilterOptions('level', this.value)">
                                <div class="filter-actions">
                                    <button class="filter-action-btn" onclick="selectAllFilterOptions('level')">Select All</button>
                                    <button class="filter-action-btn" onclick="deselectAllFilterOptions('level')">Clear</button>
                                </div>
                                <div class="filter-options" id="level-options"></div>
                            </div>
                        </div>
                        
                        <!-- Room Filter -->
                        <div class="filter-dropdown" id="filter-room">
                            <button class="filter-btn" onclick="toggleFilterPanel('room')">
                                <span>Room</span>
                                <span class="filter-badge" id="room-badge" style="display:none;">0</span>
                                <span class="arrow">▼</span>
                            </button>
                            <div class="filter-panel" id="room-panel">
                                <input type="text" class="filter-search" placeholder="Search rooms..." oninput="searchFilterOptions('room', this.value)">
                                <div class="filter-actions">
                                    <button class="filter-action-btn" onclick="selectAllFilterOptions('room')">Select All</button>
                                    <button class="filter-action-btn" onclick="deselectAllFilterOptions('room')">Clear</button>
                                </div>
                                <div class="filter-options" id="room-options"></div>
                            </div>
                        </div>
                        
                        <button class="clear-filters-btn" onclick="clearAllFilters()">Clear All Filters</button>
                    </div>
                    
                    <div class="filter-summary" id="filter-summary">Showing all assets</div>
                    
                    <div class="selection-bar">
                        <span class="selected-count" id="tandem-asset-count">0 selected</span>
                        <button class="template-btn" onclick="selectVisibleAssets()">Select Visible</button>
                        <button class="template-btn" onclick="selectAllTandemAssets()">Select All</button>
                        <button class="template-btn" onclick="deselectAllTandemAssets()">Deselect All</button>
                    </div>
                    
                    <div class="asset-list" id="tandem-asset-list"></div>
                    
                    <button class="generate-btn" onclick="generateTandemQRs()">
                        Generate QR Codes for Selected Assets
                    </button>
                    
                    <div id="tandem-output" class="output-section">
                        <div class="download-options">
                            <button class="download-btn" onclick="downloadAllZip()">📦 Download ZIP</button>
                            <button class="download-btn pdf" onclick="togglePdfOptions('tandem')">📄 Download PDF Grid</button>
                        </div>
                        <div class="pdf-options" id="tandem-pdf-options">
                            <label>Grid Size:</label>
                            <select id="tandem-grid-size">
                                <option value="2x4">2 × 4 (8 per page)</option>
                                <option value="3x5" selected>3 × 5 (15 per page)</option>
                                <option value="4x6">4 × 6 (24 per page)</option>
                            </select>
                            <button class="template-btn" onclick="generatePDF('tandem')">Generate PDF</button>
                        </div>
                        <div id="tandem-results" class="batch-results"></div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <footer class="footer">
        © 2025 ABC Healthcare · QR Code Generator
        <br><a href="index.html">← Back to Help Center Portal</a>
    </footer>

    <!-- Libraries from CDN -->
    <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

    <script>
        var PORTAL_URL = 'https://trombonepunk81.github.io/ABC-Healthcare-Portal/';
        var ASSETS_JSON_URL = 'https://trombonepunk81.github.io/ABC-Healthcare-Portal/data/assets.json';
        var currentQR = null;
        var batchQRs = [];
        var qrLibraryLoaded = false;

        // Category code to friendly name mapping
        var categoryNames = {
            'Q.SD': 'Security Device',
            'M.Eq': 'Mechanical Equipment',
            'E.Eq': 'Electrical Equipment',
            'B.Do': 'Door',
            'P.Eq': 'Plumbing Equipment',
            'F.Eq': 'Fire Protection'
        };

        function getCategoryName(code) {
            return categoryNames[code] || code || '(No Category)';
        }

        // ==================== TANDEM DATA & FILTERS ====================
        var tandemAssets = [];
        var selectedAssets = new Set();
        
        // Filter state
        var filters = {
            category: new Set(),
            level: new Set(),
            room: new Set()
        };
        
        // All unique values for each filter
        var filterOptions = {
            category: [],
            level: [],
            room: []
        };

        // Check if QRCode library loaded
        window.addEventListener('DOMContentLoaded', function() {
            var status = document.getElementById('status-bar');
            
            if (typeof QRCode !== 'undefined') {
                qrLibraryLoaded = true;
                status.textContent = '✓ Ready to generate QR codes';
                status.className = 'status-bar success';
                document.getElementById('single-gen-btn').disabled = false;
                document.getElementById('batch-gen-btn').disabled = false;
            } else {
                status.textContent = '✗ QR Code library failed to load. Check network/firewall.';
                status.className = 'status-bar error';
            }
            
            // Close dropdowns when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.filter-dropdown')) {
                    closeAllFilterPanels();
                }
            });
        });

        // Tab switching
        function switchTab(tabName) {
            var tabs = document.querySelectorAll('.tab');
            var contents = document.querySelectorAll('.tab-content');
            
            tabs.forEach(function(tab) { tab.classList.remove('active'); });
            contents.forEach(function(content) { content.classList.remove('active'); });
            
            if (tabName === 'single') {
                tabs[0].classList.add('active');
                document.getElementById('single-tab').classList.add('active');
            } else if (tabName === 'batch') {
                tabs[1].classList.add('active');
                document.getElementById('batch-tab').classList.add('active');
            } else if (tabName === 'tandem') {
                tabs[2].classList.add('active');
                document.getElementById('tandem-tab-content').classList.add('active');
            }
        }

        // Build portal URL
        function buildUrl(assetId, tandemUrl) {
            return PORTAL_URL + '?asset=' + encodeURIComponent(assetId) + '&tandem=' + encodeURIComponent(tandemUrl);
        }

        // ==================== PDF GENERATION ====================
        function togglePdfOptions(source) {
            var options = document.getElementById(source + '-pdf-options');
            options.classList.toggle('active');
        }

        function generatePDF(source) {
            var gridSelect = document.getElementById(source + '-grid-size');
            var gridSize = gridSelect.value.split('x');
            var cols = parseInt(gridSize[0]);
            var rows = parseInt(gridSize[1]);
            
            if (batchQRs.length === 0) {
                alert('No QR codes generated yet');
                return;
            }
            
            var { jsPDF } = window.jspdf;
            var pdf = new jsPDF('portrait', 'mm', 'letter');
            
            // Letter size: 215.9mm x 279.4mm
            var pageWidth = 215.9;
            var pageHeight = 279.4;
            var margin = 10;
            
            var cellWidth = (pageWidth - margin * 2) / cols;
            var cellHeight = (pageHeight - margin * 2) / rows;
            var qrSize = Math.min(cellWidth, cellHeight) - 15; // Leave room for label
            
            var itemsPerPage = cols * rows;
            var currentItem = 0;
            
            batchQRs.forEach(function(item, index) {
                if (!item || !item.element) return;
                
                // Add new page if needed
                if (currentItem > 0 && currentItem % itemsPerPage === 0) {
                    pdf.addPage();
                }
                
                var positionOnPage = currentItem % itemsPerPage;
                var col = positionOnPage % cols;
                var row = Math.floor(positionOnPage / cols);
                
                var x = margin + col * cellWidth + (cellWidth - qrSize) / 2;
                var y = margin + row * cellHeight + 2;
                
                // Get image data from canvas or img
                var imgData;
                if (item.element.tagName === 'CANVAS') {
                    imgData = item.element.toDataURL('image/png');
                } else {
                    // For img elements, we need to draw to a temp canvas
                    var tempCanvas = document.createElement('canvas');
                    tempCanvas.width = item.element.width;
                    tempCanvas.height = item.element.height;
                    var ctx = tempCanvas.getContext('2d');
                    ctx.drawImage(item.element, 0, 0);
                    imgData = tempCanvas.toDataURL('image/png');
                }
                
                // Add QR code
                pdf.addImage(imgData, 'PNG', x, y, qrSize, qrSize);
                
                // Add label below QR code
                pdf.setFontSize(8);
                pdf.setFont('helvetica', 'bold');
                var labelX = margin + col * cellWidth + cellWidth / 2;
                var labelY = y + qrSize + 4;
                pdf.text(item.assetId, labelX, labelY, { align: 'center' });
                
                // Add room/level if available
                if (item.room || item.level) {
                    pdf.setFontSize(6);
                    pdf.setFont('helvetica', 'normal');
                    var metaText = [item.room, item.level].filter(Boolean).join(' · ');
                    pdf.text(metaText, labelX, labelY + 3, { align: 'center' });
                }
                
                currentItem++;
            });
            
            pdf.save('QR_Codes_' + new Date().toISOString().slice(0, 10) + '.pdf');
        }

        // ==================== SINGLE QR CODE ====================
        function generateSingleQR() {
            var assetId = document.getElementById('asset-id').value.trim();
            var tandemUrl = document.getElementById('tandem-url').value.trim();

            if (!assetId || !tandemUrl) {
                alert('Please enter both Asset ID and Tandem URL');
                return;
            }

            var container = document.getElementById('qr-container');
            container.innerHTML = '';

            var fullUrl = buildUrl(assetId, tandemUrl);
            
            try {
                currentQR = new QRCode(container, {
                    text: fullUrl,
                    width: 256,
                    height: 256,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.L
                });

                document.getElementById('qr-asset-label').textContent = assetId;
                document.getElementById('qr-full-url').textContent = 'Portal URL: ' + fullUrl;
                document.getElementById('single-output').classList.add('active');
            } catch (err) {
                alert('Error generating QR code: ' + err.message);
            }
        }

        function downloadSingleQR() {
            var container = document.getElementById('qr-container');
            var img = container.querySelector('img');
            var canvas = container.querySelector('canvas');
            var element = img || canvas;

            if (!element) {
                alert('No QR code to download');
                return;
            }

            var assetId = document.getElementById('asset-id').value.trim();
            var exportCanvas = document.createElement('canvas');
            var ctx = exportCanvas.getContext('2d');

            var padding = 20;
            var labelHeight = 40;
            exportCanvas.width = element.width + padding * 2;
            exportCanvas.height = element.height + padding * 2 + labelHeight;

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
            ctx.drawImage(element, padding, padding);

            ctx.fillStyle = '#000000';
            ctx.font = 'bold 16px DM Sans, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(assetId, exportCanvas.width / 2, element.height + padding + 28);

            var link = document.createElement('a');
            link.download = 'QR_' + assetId.replace(/[^a-zA-Z0-9]/g, '_') + '.png';
            link.href = exportCanvas.toDataURL('image/png');
            link.click();
        }

        // ==================== BATCH QR CODES ====================
        function importExcel(event) {
            var file = event.target.files[0];
            if (!file) return;

            var reader = new FileReader();
            reader.onload = function(e) {
                try {
                    var workbook = XLSX.read(e.target.result, { type: 'binary' });
                    var sheetName = workbook.SheetNames[0];
                    var sheet = workbook.Sheets[sheetName];
                    var data = XLSX.utils.sheet_to_json(sheet);

                    var lines = data.map(function(row) {
                        var assetId = row['Asset ID'] || row['assetId'] || row['AssetID'] || '';
                        var tandemUrl = row['Tandem URL'] || row['tandemUrl'] || row['TandemURL'] || row['url'] || '';
                        return assetId + ', ' + tandemUrl;
                    }).filter(function(line) {
                        return line.trim() !== ', ';
                    });

                    document.getElementById('batch-data').value = lines.join('\n');
                } catch (err) {
                    alert('Error reading Excel file: ' + err.message);
                }
            };
            reader.readAsBinaryString(file);
        }

        function downloadTemplate() {
            var wb = XLSX.utils.book_new();
            var data = [
                ['Asset ID', 'Tandem URL'],
                ['CAM.E1879.01', 'https://tandem.autodesk.com/pages/facilities/...'],
                ['AHU.B2301.05', 'https://tandem.autodesk.com/pages/facilities/...']
            ];
            var ws = XLSX.utils.aoa_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, 'Assets');
            XLSX.writeFile(wb, 'QR_Asset_Template.xlsx');
        }

        function generateBatchQR() {
            var data = document.getElementById('batch-data').value.trim();
            if (!data) {
                alert('Please enter asset data or import an Excel file');
                return;
            }

            var lines = data.split('\n').filter(function(line) { return line.trim(); });
            var container = document.getElementById('batch-results');
            container.innerHTML = '';
            batchQRs = [];

            lines.forEach(function(line, index) {
                var parts = line.split(',');
                if (parts.length < 2) return;

                var assetId = parts[0].trim();
                var tandemUrl = parts.slice(1).join(',').trim();
                var fullUrl = buildUrl(assetId, tandemUrl);

                var div = document.createElement('div');
                div.className = 'batch-item';

                var qrDiv = document.createElement('div');
                qrDiv.id = 'qr-batch-' + index;
                div.appendChild(qrDiv);

                var label = document.createElement('div');
                label.className = 'batch-item-label';
                label.textContent = assetId;
                div.appendChild(label);

                var btn = document.createElement('button');
                btn.className = 'batch-item-download';
                btn.textContent = 'Download';
                btn.setAttribute('data-index', index);
                btn.onclick = function() {
                    downloadBatchItem(this.getAttribute('data-index'));
                };
                div.appendChild(btn);

                container.appendChild(div);

                try {
                    new QRCode(qrDiv, {
                        text: fullUrl,
                        width: 180,
                        height: 180,
                        colorDark: '#000000',
                        colorLight: '#ffffff',
                        correctLevel: QRCode.CorrectLevel.L
                    });

                    setTimeout(function() {
                        var img = qrDiv.querySelector('img');
                        var canvas = qrDiv.querySelector('canvas');
                        batchQRs[index] = {
                            assetId: assetId,
                            element: img || canvas
                        };
                    }, 50);
                } catch (err) {
                    console.error('Error generating QR for', assetId, err);
                }
            });

            setTimeout(function() {
                if (batchQRs.filter(Boolean).length > 0) {
                    document.getElementById('batch-output').classList.add('active');
                }
            }, 200);
        }

        function downloadBatchItem(index) {
            var item = batchQRs[index];
            if (!item || !item.element) return;

            var exportCanvas = document.createElement('canvas');
            var ctx = exportCanvas.getContext('2d');
            var padding = 15;
            var labelHeight = 30;

            exportCanvas.width = item.element.width + padding * 2;
            exportCanvas.height = item.element.height + padding * 2 + labelHeight;

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
            ctx.drawImage(item.element, padding, padding);

            ctx.fillStyle = '#000000';
            ctx.font = 'bold 14px DM Sans, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(item.assetId, exportCanvas.width / 2, item.element.height + padding + 22);

            var link = document.createElement('a');
            link.download = 'QR_' + item.assetId.replace(/[^a-zA-Z0-9]/g, '_') + '.png';
            link.href = exportCanvas.toDataURL('image/png');
            link.click();
        }

        function downloadAllZip() {
            var zip = new JSZip();

            batchQRs.forEach(function(item, index) {
                if (!item || !item.element) return;

                var exportCanvas = document.createElement('canvas');
                var ctx = exportCanvas.getContext('2d');
                var padding = 15;
                var labelHeight = 30;

                exportCanvas.width = item.element.width + padding * 2;
                exportCanvas.height = item.element.height + padding * 2 + labelHeight;

                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
                ctx.drawImage(item.element, padding, padding);

                ctx.fillStyle = '#000000';
                ctx.font = 'bold 14px DM Sans, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(item.assetId, exportCanvas.width / 2, item.element.height + padding + 22);

                var dataUrl = exportCanvas.toDataURL('image/png');
                var base64 = dataUrl.split(',')[1];
                var filename = 'QR_' + item.assetId.replace(/[^a-zA-Z0-9]/g, '_') + '.png';
                zip.file(filename, base64, { base64: true });
            });

            zip.generateAsync({ type: 'blob' }).then(function(blob) {
                var link = document.createElement('a');
                link.download = 'QR_Codes_' + new Date().toISOString().slice(0, 10) + '.zip';
                link.href = URL.createObjectURL(blob);
                link.click();
            });
        }

        // ==================== TANDEM CONNECT ====================
        async function loadTandemAssets() {
            var btn = document.getElementById('load-tandem-btn');
            var btnText = document.getElementById('tandem-btn-text');
            var spinner = document.getElementById('tandem-spinner');
            var status = document.getElementById('tandem-status');
            
            btn.disabled = true;
            spinner.style.display = 'inline-block';
            btnText.textContent = 'Loading...';
            status.style.display = 'block';
            status.className = 'status-bar loading';
            status.textContent = 'Fetching assets from Tandem Connect...';
            
            try {
                var response = await fetch(ASSETS_JSON_URL);
                
                if (!response.ok) {
                    throw new Error('Failed to load assets. Status: ' + response.status);
                }
                
                var data = await response.json();
                tandemAssets = data.assets || [];
                
                if (tandemAssets.length === 0) {
                    throw new Error('No assets found in data file');
                }
                
                // Build filter options from data
                buildFilterOptions();
                
                // Select all filter options by default
                initializeFilters();
                
                // DEFAULT: Select only visible assets (all are visible initially)
                selectVisibleAssets();
                
                // Show success
                var lastUpdated = data.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : 'Unknown';
                status.className = 'status-bar success';
                status.textContent = '✅ Loaded ' + tandemAssets.length + ' assets (Last updated: ' + lastUpdated + ')';
                
                // Display
                renderFilterOptions();
                displayTandemAssets();
                
                document.getElementById('tandem-loaded').style.display = 'block';
                btn.style.display = 'none';
                
            } catch (error) {
                status.className = 'status-bar error';
                status.textContent = '❌ Error: ' + error.message;
                btn.disabled = false;
                spinner.style.display = 'none';
                btnText.textContent = 'Load Assets from Tandem';
            }
        }

        function buildFilterOptions() {
            var categories = new Map();
            var levels = new Map();
            var rooms = new Map();
            
            tandemAssets.forEach(function(asset) {
                var cat = asset.category || '';
                var lev = asset.level || '';
                var room = asset.room || '';
                
                categories.set(cat, (categories.get(cat) || 0) + 1);
                levels.set(lev, (levels.get(lev) || 0) + 1);
                rooms.set(room, (rooms.get(room) || 0) + 1);
            });
            
            filterOptions.category = Array.from(categories.entries()).sort(function(a, b) {
                return getCategoryName(a[0]).localeCompare(getCategoryName(b[0]));
            });
            filterOptions.level = Array.from(levels.entries()).sort(function(a, b) {
                return a[0].localeCompare(b[0]);
            });
            filterOptions.room = Array.from(rooms.entries()).sort(function(a, b) {
                return a[0].localeCompare(b[0]);
            });
        }

        function initializeFilters() {
            filters.category = new Set(filterOptions.category.map(function(o) { return o[0]; }));
            filters.level = new Set(filterOptions.level.map(function(o) { return o[0]; }));
            filters.room = new Set(filterOptions.room.map(function(o) { return o[0]; }));
        }

        function renderFilterOptions() {
            renderFilterOptionsForType('category');
            renderFilterOptionsForType('level');
            renderFilterOptionsForType('room');
            updateFilterBadges();
        }

        function renderFilterOptionsForType(type) {
            var container = document.getElementById(type + '-options');
            container.innerHTML = '';
            
            filterOptions[type].forEach(function(option) {
                var value = option[0];
                var count = option[1];
                var displayName = type === 'category' ? getCategoryName(value) : (value || '(Blank)');
                
                var div = document.createElement('div');
                div.className = 'filter-option';
                div.setAttribute('data-value', value);
                div.setAttribute('data-search', displayName.toLowerCase());
                
                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = filters[type].has(value);
                checkbox.onchange = function() {
                    toggleFilterOption(type, value, this.checked);
                };
                
                var label = document.createElement('span');
                label.className = 'filter-option-label';
                label.textContent = displayName;
                
                var countSpan = document.createElement('span');
                countSpan.className = 'filter-option-count';
                countSpan.textContent = count;
                
                div.appendChild(checkbox);
                div.appendChild(label);
                div.appendChild(countSpan);
                
                div.onclick = function(e) {
                    if (e.target !== checkbox) {
                        checkbox.checked = !checkbox.checked;
                        toggleFilterOption(type, value, checkbox.checked);
                    }
                };
                
                container.appendChild(div);
            });
        }

        function toggleFilterOption(type, value, checked) {
            if (checked) {
                filters[type].add(value);
            } else {
                filters[type].delete(value);
            }
            applyFilters();
        }

        function selectAllFilterOptions(type) {
            filters[type] = new Set(filterOptions[type].map(function(o) { return o[0]; }));
            renderFilterOptionsForType(type);
            applyFilters();
        }

        function deselectAllFilterOptions(type) {
            filters[type].clear();
            renderFilterOptionsForType(type);
            applyFilters();
        }

        function searchFilterOptions(type, query) {
            var options = document.querySelectorAll('#' + type + '-options .filter-option');
            var lowerQuery = query.toLowerCase();
            
            options.forEach(function(opt) {
                var searchText = opt.getAttribute('data-search');
                opt.classList.toggle('hidden', !searchText.includes(lowerQuery));
            });
        }

        function toggleFilterPanel(type) {
            var panel = document.getElementById(type + '-panel');
            var btn = panel.previousElementSibling;
            var isOpen = panel.classList.contains('open');
            
            closeAllFilterPanels();
            
            if (!isOpen) {
                panel.classList.add('open');
                btn.classList.add('open');
            }
        }

        function closeAllFilterPanels() {
            document.querySelectorAll('.filter-panel').forEach(function(p) { p.classList.remove('open'); });
            document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('open'); });
        }

        function clearAllFilters() {
            initializeFilters();
            renderFilterOptions();
            applyFilters();
        }

        function updateFilterBadges() {
            ['category', 'level', 'room'].forEach(function(type) {
                var total = filterOptions[type].length;
                var selected = filters[type].size;
                var badge = document.getElementById(type + '-badge');
                var btn = badge.closest('.filter-btn');
                
                if (selected < total) {
                    badge.textContent = selected;
                    badge.style.display = 'inline';
                    btn.classList.add('active');
                } else {
                    badge.style.display = 'none';
                    btn.classList.remove('active');
                }
            });
        }

        function applyFilters() {
            updateFilterBadges();
            displayTandemAssets();
        }

        function assetPassesFilters(asset) {
            var catValue = asset.category || '';
            var levValue = asset.level || '';
            var roomValue = asset.room || '';
            
            return filters.category.has(catValue) &&
                   filters.level.has(levValue) &&
                   filters.room.has(roomValue);
        }

        function displayTandemAssets() {
            var container = document.getElementById('tandem-asset-list');
            container.innerHTML = '';
            
            var visibleCount = 0;
            
            tandemAssets.forEach(function(asset) {
                var passesFilter = assetPassesFilters(asset);
                var isSelected = selectedAssets.has(asset.assetId);
                
                var div = document.createElement('div');
                div.className = 'asset-item' + (isSelected ? ' selected' : '') + (!passesFilter ? ' hidden' : '');
                div.setAttribute('data-asset-id', asset.assetId);
                div.onclick = function() { toggleAssetSelection(asset.assetId); };
                
                if (passesFilter) {
                    visibleCount++;
                }
                
                var metaTags = '';
                if (asset.category) {
                    metaTags += '<span class="category-tag">' + getCategoryName(asset.category) + '</span>';
                }
                if (asset.level) {
                    metaTags += '<span>📍 ' + asset.level + '</span>';
                }
                if (asset.room) {
                    metaTags += '<span>🚪 ' + asset.room + '</span>';
                }
                
                div.innerHTML = 
                    '<div class="asset-item-name">' + asset.assetId + '</div>' +
                    (metaTags ? '<div class="asset-item-meta">' + metaTags + '</div>' : '') +
                    '<div style="font-size:0.7rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-top:0.35rem; color: var(--slate-400);">' +
                    (asset.assetUrl ? '🔗 Tandem Link' : 'No URL') + '</div>';
                
                container.appendChild(div);
            });
            
            updateSelectedCount();
            updateFilterSummary(visibleCount);
        }

        function updateFilterSummary(visibleCount) {
            var summary = document.getElementById('filter-summary');
            if (visibleCount === tandemAssets.length) {
                summary.textContent = 'Showing all ' + tandemAssets.length + ' assets';
            } else {
                summary.textContent = 'Showing ' + visibleCount + ' of ' + tandemAssets.length + ' assets (filtered)';
            }
        }

        function toggleAssetSelection(assetId) {
            if (selectedAssets.has(assetId)) {
                selectedAssets.delete(assetId);
            } else {
                selectedAssets.add(assetId);
            }
            displayTandemAssets();
        }

        function selectVisibleAssets() {
            // Clear current selection first, then select only visible
            selectedAssets.clear();
            tandemAssets.forEach(function(asset) {
                if (assetPassesFilters(asset)) {
                    selectedAssets.add(asset.assetId);
                }
            });
            displayTandemAssets();
        }

        function selectAllTandemAssets() {
            // Select ALL assets regardless of filter
            selectedAssets = new Set(tandemAssets.map(function(a) { return a.assetId; }));
            displayTandemAssets();
        }

        function deselectAllTandemAssets() {
            selectedAssets.clear();
            displayTandemAssets();
        }

        function updateSelectedCount() {
            var countEl = document.getElementById('tandem-asset-count');
            countEl.textContent = selectedAssets.size + ' selected';
        }

        function generateTandemQRs() {
            if (selectedAssets.size === 0) {
                alert('Please select at least one asset');
                return;
            }
            
            var container = document.getElementById('tandem-results');
            container.innerHTML = '';
            batchQRs = [];
            
            var selectedAssetData = tandemAssets.filter(function(a) { 
                return selectedAssets.has(a.assetId); 
            });
            
            selectedAssetData.forEach(function(asset, index) {
                var fullUrl = buildUrl(asset.assetId, asset.assetUrl);
                
                var div = document.createElement('div');
                div.className = 'batch-item';
                
                var qrDiv = document.createElement('div');
                qrDiv.id = 'qr-tandem-' + index;
                div.appendChild(qrDiv);
                
                var label = document.createElement('div');
                label.className = 'batch-item-label';
                label.textContent = asset.assetId;
                div.appendChild(label);
                
                if (asset.room || asset.level) {
                    var meta = document.createElement('div');
                    meta.style.cssText = 'font-size: 0.7rem; color: var(--slate-500); margin-top: 0.25rem;';
                    meta.textContent = [asset.room, asset.level].filter(Boolean).join(' · ');
                    div.appendChild(meta);
                }
                
                var btn = document.createElement('button');
                btn.className = 'batch-item-download';
                btn.textContent = 'Download';
                btn.setAttribute('data-index', index);
                btn.onclick = function() {
                    downloadBatchItem(this.getAttribute('data-index'));
                };
                div.appendChild(btn);
                
                container.appendChild(div);
                
                try {
                    new QRCode(qrDiv, {
                        text: fullUrl,
                        width: 180,
                        height: 180,
                        colorDark: '#000000',
                        colorLight: '#ffffff',
                        correctLevel: QRCode.CorrectLevel.L
                    });
                    
                    setTimeout(function() {
                        var img = qrDiv.querySelector('img');
                        var canvas = qrDiv.querySelector('canvas');
                        batchQRs[index] = {
                            assetId: asset.assetId,
                            room: asset.room || '',
                            level: asset.level || '',
                            element: img || canvas
                        };
                    }, 50);
                    
                } catch (err) {
                    console.error('Error generating QR for', asset.assetId, err);
                    qrDiv.textContent = 'Error';
                }
            });
            
            setTimeout(function() {
                if (batchQRs.filter(Boolean).length > 0) {
                    document.getElementById('tandem-output').classList.add('active');
                }
            }, 200);
        }
    </script>
</body>
</html>

