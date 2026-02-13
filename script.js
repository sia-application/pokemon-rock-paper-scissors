
document.addEventListener('DOMContentLoaded', () => {
    console.log('Pokemon Janken App Loaded');

    // ===== Online Battle State =====
    let isOnlineMode = false;
    let isHost = false;
    let peer = null;
    let conn = null;
    let roomId = null;
    let myPokemonSelected = null;
    let opponentPokemonSelected = null;
    let waitingForOpponent = false;
    let lastCreatedRoomId = null; // To prevent joining own room

    // Online mode UI elements
    const modeSelectionScreen = document.getElementById('mode-selection-screen');
    const onlineRoomScreen = document.getElementById('online-room-screen');
    const localModeBtn = document.getElementById('local-mode-btn');
    const onlineModeBtn = document.getElementById('online-mode-btn');
    const backToModeBtn = document.getElementById('back-to-mode-btn');
    const createRoomBtn = document.getElementById('create-room-btn');
    const joinRoomBtn = document.getElementById('join-room-btn');
    const roomIdInput = document.getElementById('room-id-input');
    const connectionStatus = document.getElementById('connection-status');
    const statusIcon = document.getElementById('status-icon');
    const statusText = document.getElementById('status-text');
    const roomIdDisplay = document.getElementById('room-id-display');
    const displayRoomId = document.getElementById('display-room-id');
    const copyRoomIdBtn = document.getElementById('copy-room-id-btn');
    const cancelConnectionBtn = document.getElementById('cancel-connection-btn');

    // Generate random room ID (8 chars uppercase)
    // Generate random room ID (Random Pokemon Name)
    function generateRoomId() {
        if (!pokemonData || pokemonData.length === 0) {
            // Fallback to alphanumeric if data not loaded
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 8; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        }

        // Filter for simple names: no parentheses, no special characters, max 10 chars
        const simpleNames = pokemonData
            .map(p => p.name)
            .filter(name => {
                return !name.includes('(') &&
                    !name.includes('・') &&
                    !name.includes(' ') &&
                    name.length <= 10;
            });

        const listToUse = simpleNames.length > 0 ? simpleNames : pokemonData.map(p => p.name);
        return listToUse[Math.floor(Math.random() * listToUse.length)];
    }

    // Safe ID encoding (Hex) to allow Japanese characters in PeerJS IDs
    function encodeIdSafe(str) {
        if (!str) return str;
        return Array.from(new TextEncoder().encode(str.trim()))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    // Initialize PeerJS
    function initPeer(id = null) {
        return new Promise((resolve, reject) => {
            const peerId = id ? `pokemon-janken-${encodeIdSafe(id)}` : undefined;
            peer = new Peer(peerId, {
                debug: 1
            });

            peer.on('open', (id) => {
                console.log('My peer ID is:', id);
                resolve(id);
            });

            peer.on('error', (err) => {
                console.error('PeerJS error:', err);
                if (err.type === 'unavailable-id') {
                    showConnectionError('このあいことばはすでにつかわれています');
                } else if (err.type === 'peer-unavailable') {
                    showConnectionError('おへやがみつかりません');
                } else {
                    showConnectionError('せつぞくエラー: ' + err.type);
                }
                reject(err);
            });

            peer.on('connection', (connection) => {
                // Host receives connection
                conn = connection;
                setupConnectionHandlers();
            });
        });
    }

    // Setup connection event handlers
    function setupConnectionHandlers() {
        conn.on('open', () => {
            console.log('Connection established');
            onConnectionEstablished();
        });

        conn.on('data', (data) => {
            handlePeerMessage(data);
        });

        conn.on('close', () => {
            console.log('Connection closed');
            onConnectionClosed();
        });

        conn.on('error', (err) => {
            console.error('Connection error:', err);
            showConnectionError('せつぞくがきれました');
        });
    }

    // Handle incoming messages from peer
    function handlePeerMessage(data) {
        console.log('Received:', data);
        switch (data.type) {
            case 'pokemon_selected':
                opponentPokemonSelected = data.pokemon;
                if (data.playerName) {
                    if (isHost) {
                        player2Name = data.playerName;
                    } else {
                        player1Name = data.playerName;
                    }
                }
                // Show notification that opponent has selected
                if (!myPokemonSelected) {
                    showOpponentReadyIndicator();
                    // If host, disable mode select when guest selects first
                    if (isHost) {
                        const modeSelect = document.getElementById('mode-select');
                        if (modeSelect) modeSelect.disabled = true;

                        // Also disable type mode toggles if guest selects first
                        const battleRuleToggle = document.getElementById('battle-rule-toggle');
                        const constraintToggle = document.getElementById('constraint-toggle');
                        if (battleRuleToggle) battleRuleToggle.disabled = true;
                        if (constraintToggle) constraintToggle.disabled = true;
                    }
                }
                checkBothPlayersReady();
                break;
            case 'game_settings':
                // Sync game settings from host
                if (!isHost) {
                    applyGameSettings(data.settings);
                }
                break;
            case 'start_selection':
                // Guest receives signal to start selection
                showSelectionScreen();
                break;
            case 'rematch':
                // Opponent wants to play again
                handleRematch();
                break;
            case 'show_result':
                // Opponent clicked show result button
                handleShowResult();
                break;
            case 'settings_change':
                // Host changed settings, apply to guest
                // OR Guest changed settings, apply to host
                applySettingsChange(data);
                break;
            case 'rule_changed':
                if (data.type === 'rule_changed') {
                    applyRuleChange(data);
                }
                break;
            case 'back_to_rules':
                showRuleSettingScreen();
                // Reset local state if needed
                clearSelection();
                player1Pokemon = null;
                myPokemonSelected = null;
                opponentPokemonSelected = null;
                updateInstruction();
                break;
            case 'proceed_to_selection':
                // Received signal to transition from rules to selection
                showSelectionScreen();
                break;
        }
    }

    // Handle show result from opponent
    function handleShowResult() {
        const viewResultBtn = document.getElementById('view-result-btn');
        if (viewResultBtn) {
            viewResultBtn.style.display = 'none';
            viewResultBtn.onclick = null;
        }
        // Resolve battle with current pokemon
        if (isHost && myPokemonSelected && opponentPokemonSelected) {
            resolveBattle(myPokemonSelected, opponentPokemonSelected);
        } else if (!isHost && myPokemonSelected && opponentPokemonSelected) {
            resolveBattle(opponentPokemonSelected, myPokemonSelected);
        }
    }

    // Handle rematch request from opponent
    function handleRematch() {
        window.scrollTo(0, 0);
        // Reset game state
        myPokemonSelected = null;
        opponentPokemonSelected = null;
        waitingForOpponent = false;
        hideWaitingIndicator();
        player1Pokemon = null;
        // Do not reset player names on rematch
        // player1Name = '';
        // player2Name = '';
        selectedPokemon = null;

        // Hide battle screen
        battleScreen.classList.remove('active');
        battleScreen.classList.add('hidden');

        // Hide result display
        resultDisplay.classList.add('hidden');

        // Clear fighter displays
        playerFighterEl.innerHTML = '';
        cpuFighterEl.innerHTML = '';
        playerFighterEl.style.borderColor = '#ddd';
        cpuFighterEl.style.borderColor = '#ddd';

        // Reset View Result Button
        const viewResultBtn = document.getElementById('view-result-btn');
        if (viewResultBtn) {
            viewResultBtn.style.display = 'none';
            viewResultBtn.onclick = null;
        }

        // Reset header color
        document.querySelector('.game-header').classList.remove('player2-turn');
        document.querySelector('.game-header').classList.remove('draw-result');
        restartBtn.style.background = '';

        // Show selection screen
        selectionScreen.classList.remove('hidden');
        selectionScreen.classList.add('active');

        if (isHost) {
            player1NameGroup.classList.remove('hidden');
            player2NameGroup.classList.add('hidden');
        } else {
            // Guest is Trainer 2
            player1NameGroup.classList.add('hidden');
            player2NameGroup.classList.remove('hidden');
            document.querySelector('.game-header').classList.add('player2-turn');
        }

        // Re-enable selection UI
        enableSelectionUI();

        instructionText.textContent = 'つぎのポケモンをえらぼう！';
    }

    // Check if both players have selected
    function checkBothPlayersReady() {
        if (myPokemonSelected && opponentPokemonSelected) {
            // Both players ready, start battle
            waitingForOpponent = false;
            hideWaitingIndicator();

            if (isHost) {
                if (myPokemonSelected.isTypeOnly) {
                    startTypeBattle(myPokemonSelected, opponentPokemonSelected);
                } else {
                    startGame(myPokemonSelected, opponentPokemonSelected);
                }
            } else {
                if (myPokemonSelected.isTypeOnly) {
                    startTypeBattle(opponentPokemonSelected, myPokemonSelected);
                } else {
                    startGame(opponentPokemonSelected, myPokemonSelected);
                }
            }
        } else if (myPokemonSelected && !opponentPokemonSelected) {
            // Show waiting indicator
            showWaitingIndicator();
        }
    }

    // Create room (Host)
    async function createRoom() {
        // If already created, copy to clipboard
        if (isHost && roomId) {
            handleCopyRoomId();
            return;
        }

        roomId = generateRoomId();
        lastCreatedRoomId = roomId; // Store for self-connect check
        isHost = true;
        isOnlineMode = true;

        showConnectionStatus('おへやをつくっています...');

        try {
            await initPeer(roomId);
            showRoomCreated(roomId);
        } catch (err) {
            console.error('Failed to create room:', err);
        }
    }

    // Handle Copy Room ID (for the main button)
    function handleCopyRoomId() {
        if (!roomId) return;

        const createRoomBtn = document.getElementById('create-room-btn');
        const originalText = createRoomBtn.textContent;

        navigator.clipboard.writeText(roomId).then(() => {
            createRoomBtn.textContent = 'コピーしました！';
            setTimeout(() => {
                createRoomBtn.textContent = 'あいことばをコピー';
            }, 2000);
        }).catch(err => {
            // Fallback
            const textArea = document.createElement("textarea");
            textArea.value = roomId;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            createRoomBtn.textContent = 'コピーしました！';
            setTimeout(() => {
                createRoomBtn.textContent = 'あいことばをコピー';
            }, 2000);
        });
    }

    // Join room (Guest)
    async function joinRoom(targetRoomId) {
        if (!targetRoomId || targetRoomId.length === 0) {
            showConnectionError('あいことばをいれてください');
            return;
        }

        // Prevent joining own room (same browser/same person)
        if (targetRoomId.toUpperCase() === lastCreatedRoomId) {
            showConnectionError('じぶんでつくったおへやにははいれません');
            return;
        }

        isHost = false;
        isOnlineMode = true;
        roomId = targetRoomId.trim().toUpperCase();

        showConnectionStatus('おへやにせつぞくちゅう...');

        try {
            await initPeer();
            const peerIdToConnect = `pokemon-janken-${encodeIdSafe(roomId)}`;
            conn = peer.connect(peerIdToConnect);
            setupConnectionHandlers();
        } catch (err) {
            console.error('Failed to join room:', err);
        }
    }

    // Connection established callback
    function onConnectionEstablished() {
        statusIcon.textContent = '✅';
        statusIcon.classList.add('connected');
        statusText.textContent = 'せつぞくしました！';
        cancelConnectionBtn.classList.add('hidden');

        // If Host, send current settings to Guest immediately
        if (isHost) {
            sendCurrentSettings();
        }

        // Short delay then go to rule setting screen
        setTimeout(() => {
            // Hide online room screen
            onlineRoomScreen.classList.remove('active');
            onlineRoomScreen.classList.add('hidden');

            // Show rule setting screen
            showRuleSettingScreen();
        }, 1000);
    }

    // Connection closed callback
    function onConnectionClosed() {
        if (isOnlineMode) {
            alert('あいてとのせつぞくがきれました。タイトルにもどります。');
            window.location.reload();
        }
    }

    // Show connection status
    function showConnectionStatus(message) {
        connectionStatus.classList.remove('hidden');
        statusIcon.textContent = '⏳';
        statusIcon.classList.remove('connected');
        statusText.textContent = message;
        cancelConnectionBtn.classList.remove('hidden');
    }

    // Show room created with ID
    function showRoomCreated(id) {
        statusIcon.textContent = '📡';
        statusText.textContent = 'ともだちをまっています...';

        // Hide bottom display
        roomIdDisplay.classList.add('hidden');

        // Show in card
        const createdRoomIdInput = document.getElementById('created-room-id-input');
        const createRoomBtn = document.getElementById('create-room-btn');

        if (createdRoomIdInput) {
            // createdRoomIdInput.style.display = 'block'; // Always visible now
            createdRoomIdInput.value = id;
        }

        if (createRoomBtn) {
            createRoomBtn.textContent = 'あいことばをコピー';
        }

        // displayRoomId.textContent = id; // No longer needed
    }

    // Show connection error
    function showConnectionError(message) {
        statusIcon.textContent = '❌';
        statusIcon.classList.remove('connected');
        statusText.textContent = message;
        cancelConnectionBtn.classList.remove('hidden');
        roomIdDisplay.classList.add('hidden');
    }

    // Show selection screen
    function showSelectionScreen() {
        window.scrollTo(0, 0);
        syncSelectionFiltersWithRules();
        applyAllFilters();

        // Hide rule setting screen
        const ruleSettingScreen = document.getElementById('rule-setting-screen');
        if (ruleSettingScreen) {
            ruleSettingScreen.classList.remove('active');
            ruleSettingScreen.classList.add('hidden');
        }

        selectionScreen.classList.remove('hidden');
        selectionScreen.classList.add('active');

        // Update instruction text for both local and online modes
        instructionText.textContent = 'ポケモンをえらぼう！';

        // Setup for online mode
        if (isOnlineMode) {

            if (isHost) {
                // Host is Trainer 1
                player1NameGroup.classList.remove('hidden');
                player2NameGroup.classList.add('hidden');
                // Ensure header is default color (Trainer 1)
                document.querySelector('.game-header').classList.remove('player2-turn');
            } else {
                // Guest is Trainer 2
                player1NameGroup.classList.add('hidden');
                player2NameGroup.classList.remove('hidden');

                // Change header color for Player 2
                document.querySelector('.game-header').classList.add('player2-turn');

                // Change confirm button color for Player 2
                const confirmBtn = document.getElementById('type-confirm-btn');
                if (confirmBtn) {
                    confirmBtn.style.background = 'var(--secondary-color)';
                }

                // Guest (not host) cannot change mode/filters - disable them
                disableFiltersForGuest();
            }
        }
    }

    // Sync regional and type filter dropdowns with active rules
    function syncSelectionFiltersWithRules() {
        // --- Sync Region Filter ---
        const regionFilter = document.getElementById('region-filter');
        if (regionFilter) {
            const currentRegion = regionFilter.value;
            regionFilter.innerHTML = '';

            const allRegOption = document.createElement('option');
            allRegOption.value = 'all';
            allRegOption.textContent = 'すべてのちほう';
            regionFilter.appendChild(allRegOption);

            ruleRegions.forEach(regionKey => {
                if (REGION_LABELS[regionKey]) {
                    const option = document.createElement('option');
                    option.value = regionKey;
                    option.textContent = REGION_LABELS[regionKey];
                    regionFilter.appendChild(option);
                }
            });

            const regOptions = Array.from(regionFilter.options).map(o => o.value);
            regionFilter.value = regOptions.includes(currentRegion) ? currentRegion : 'all';
        }

        // --- Sync Type Filters ---
        const type1Filter = document.getElementById('type1-filter');
        const type2Filter = document.getElementById('type2-filter');

        if (type1Filter && type2Filter) {
            const currentType1 = type1Filter.value;
            const currentType2 = type2Filter.value;

            type1Filter.innerHTML = '';
            type2Filter.innerHTML = '';

            // Type 1 "All"
            const allType1 = document.createElement('option');
            allType1.value = 'all';
            allType1.textContent = 'タイプ1';
            type1Filter.appendChild(allType1);

            // Type 2 "All" and "None"
            const allType2 = document.createElement('option');
            allType2.value = 'all';
            allType2.textContent = 'タイプ2';
            type2Filter.appendChild(allType2);

            const noneType2 = document.createElement('option');
            noneType2.value = 'none';
            noneType2.textContent = 'なし';
            type2Filter.appendChild(noneType2);

            // Add permitted types
            ruleTypes.forEach(typeKey => {
                if (TYPE_LABELS[typeKey]) {
                    // For Type 1
                    const opt1 = document.createElement('option');
                    opt1.value = typeKey;
                    opt1.textContent = TYPE_LABELS[typeKey];
                    type1Filter.appendChild(opt1);

                    // For Type 2
                    const opt2 = document.createElement('option');
                    opt2.value = typeKey;
                    opt2.textContent = TYPE_LABELS[typeKey];
                    type2Filter.appendChild(opt2);
                }
            });

            // Restore/Reset Type 1
            const options1 = Array.from(type1Filter.options).map(o => o.value);
            type1Filter.value = options1.includes(currentType1) ? currentType1 : 'all';

            // Restore/Reset Type 2
            const options2 = Array.from(type2Filter.options).map(o => o.value);
            type2Filter.value = options2.includes(currentType2) ? currentType2 : 'all';
        }

        // --- Sync Type Selection Grid (Type Mode) ---
        const typeGrid = document.getElementById('type-selection-grid');
        if (typeGrid) {
            const buttons = typeGrid.querySelectorAll('.type-btn');
            buttons.forEach(btn => {
                const type = btn.dataset.type;
                if (ruleTypes.includes(type)) {
                    btn.disabled = false;
                    btn.style.opacity = '1';
                } else {
                    btn.disabled = true;
                    btn.style.opacity = '0.3';
                    if (btn.classList.contains('selected')) {
                        btn.classList.remove('selected');
                        player1SelectedTypes = player1SelectedTypes.filter(t => t !== type);
                    }
                }
            });
        }
    }

    // Disable filters for guest in online mode
    function disableFiltersForGuest() {
        // We now allow guests to change rules, so do nothing here.
        // We might want to just log or ensure things are enabled.
        const elements = ['mode-select', 'region-filter', 'type1-filter', 'type2-filter'];
        elements.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.disabled = false;
        });

        // Also ensure buttons are enabled
        document.querySelectorAll('.segment-btn').forEach(btn => btn.disabled = false);
    }



    // Enable filters (for host or local mode)
    function enableFilters() {
        const modeSelect = document.getElementById('mode-select');
        const regionFilter = document.getElementById('region-filter');
        const type1Filter = document.getElementById('type1-filter');
        const type2Filter = document.getElementById('type2-filter');

        if (modeSelect) modeSelect.disabled = false;
        if (regionFilter) regionFilter.disabled = false;
        if (type1Filter) type1Filter.disabled = false;
        if (type2Filter) type2Filter.disabled = false;

        if (type2Filter) type2Filter.disabled = false;

        const battleRuleToggle = document.getElementById('battle-rule-toggle');
        const constraintToggle = document.getElementById('constraint-toggle');
        if (battleRuleToggle) battleRuleToggle.disabled = false;
        if (constraintToggle) constraintToggle.disabled = false;
    }

    // Show mode selection screen
    function showModeSelectionScreen() {
        window.scrollTo(0, 0);
        modeSelectionScreen.classList.remove('hidden');
        modeSelectionScreen.classList.add('active');
        onlineRoomScreen.classList.remove('active');
        onlineRoomScreen.classList.add('hidden');
        selectionScreen.classList.remove('active');
        selectionScreen.classList.add('hidden');

        const ruleSettingScreen = document.getElementById('rule-setting-screen');
        if (ruleSettingScreen) {
            ruleSettingScreen.classList.remove('active');
            ruleSettingScreen.classList.add('hidden');
        }

        // Update instruction text
        instructionText.textContent = 'バトルモードをえらぼう！';
    }

    // Show rule setting screen
    function showRuleSettingScreen() {
        window.scrollTo(0, 0);
        modeSelectionScreen.classList.remove('active');
        modeSelectionScreen.classList.add('hidden');
        onlineRoomScreen.classList.remove('active');
        onlineRoomScreen.classList.add('hidden');
        selectionScreen.classList.remove('active');
        selectionScreen.classList.add('hidden');

        const ruleSettingScreen = document.getElementById('rule-setting-screen');
        if (ruleSettingScreen) {
            ruleSettingScreen.classList.remove('hidden');
            ruleSettingScreen.classList.add('active');
        }

        if (isOnlineMode) {
            instructionText.textContent = 'あいてとルールをきめよう！';
            if (!isHost) {
                disableRuleSettingForGuest();
            } else {
                enableRuleSetting();
            }
        } else {
            instructionText.textContent = 'ルールをきめよう！';
            enableRuleSetting();
        }
    }

    // Disable rule setting for guest
    // Disable rule setting for guest -> Now ENABLES it
    function disableRuleSettingForGuest() {
        // We now allow guests to change rules.
        enableRuleSetting();
    }

    // Enable rule setting
    function enableRuleSetting() {
        const elements = [
            'mode-select', 'region-filter', 'type1-filter', 'type2-filter',
            'start-selection-btn'
        ];
        elements.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.disabled = false;
        });

        // Enable buttons in segmented controls
        document.querySelectorAll('.segment-btn').forEach(btn => btn.disabled = false);

        // Enable rule checkbox containers and bulk buttons
        const containers = ['rule-region-checkboxes', 'rule-type-checkboxes'];
        containers.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.querySelectorAll('input').forEach(cb => cb.disabled = false);
            }
        });
        document.querySelectorAll('.bulk-btn').forEach(btn => {
            btn.disabled = false;
        });
    }

    // Apply rule change from peer
    function applyRuleChange(data) {
        if (data.mode !== undefined) {
            document.getElementById('mode-select').value = data.mode;
            handleModeChange({ target: { value: data.mode }, fromPeer: true });
        }

        if (data.battleRule !== undefined) {
            applyBattleRuleChange(data.battleRule === 'double');
        }
        if (data.constraint !== undefined) {
            applyConstraintChange(data.constraint === true || data.constraint === 'true');
        }
        if (data.calcMethod !== undefined) {
            applyCalcMethodChange(data.calcMethod);
        }

        if (data.ruleRegions !== undefined) {
            ruleRegions = data.ruleRegions;
            const container = document.getElementById('rule-region-checkboxes');
            if (container) {
                container.querySelectorAll('input').forEach(cb => {
                    cb.checked = ruleRegions.includes(cb.value);
                });
                updateBulkButtonLabel('rule-region-checkboxes');
            }
        }
        if (data.ruleTypes !== undefined) {
            ruleTypes = data.ruleTypes;
            const container = document.getElementById('rule-type-checkboxes');
            if (container) {
                container.querySelectorAll('input').forEach(cb => {
                    cb.checked = ruleTypes.includes(cb.value);
                });
                updateBulkButtonLabel('rule-type-checkboxes');
            }
        }

        syncSelectionFiltersWithRules();
    }

    // Helper to update bulk button label
    function updateBulkButtonLabel(containerId) {
        const btn = document.querySelector(`.toggle-bulk-btn[data-target="${containerId}"]`);
        const container = document.getElementById(containerId);
        if (btn && container) {
            const checkboxes = container.querySelectorAll('input');
            const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
            btn.textContent = (checkedCount === checkboxes.length) ? '全解除' : '全選択';
        }
    }

    // Cancel connection
    function cancelConnection() {
        if (peer) {
            peer.destroy();
            peer = null;
        }
        if (conn) {
            conn.close();
            conn = null;
        }
        resetOnlineState();
        connectionStatus.classList.add('hidden');
        roomIdDisplay.classList.add('hidden');
    }

    // Reset online state
    function resetOnlineState() {
        isOnlineMode = false;
        isHost = false;
        roomId = null;
        myPokemonSelected = null;
        opponentPokemonSelected = null;
        waitingForOpponent = false;
        if (peer) {
            peer.destroy();
            peer = null;
        }
        conn = null;
    }

    // Show waiting for opponent indicator
    function showWaitingIndicator() {
        waitingForOpponent = true;
        instructionText.textContent = 'あいてのせんたくをまっています...';

        // Add waiting indicator if not exists
        let waitingEl = document.querySelector('.waiting-indicator');
        if (!waitingEl) {
            waitingEl = document.createElement('div');
            waitingEl.className = 'waiting-indicator';
            waitingEl.innerHTML = `
                <span class="waiting-icon">⏳</span>
                <p>あいてをまっています...</p>
            `;
            selectionScreen.insertBefore(waitingEl, selectionScreen.firstChild);
        }
    }

    // Hide waiting indicator
    function hideWaitingIndicator() {
        waitingForOpponent = false;
        const waitingEl = document.querySelector('.waiting-indicator');
        if (waitingEl) {
            waitingEl.remove();
        }
        // Also hide opponent ready indicator
        const opponentReadyEl = document.querySelector('.opponent-ready-indicator');
        if (opponentReadyEl) {
            opponentReadyEl.remove();
        }
    }

    // Show opponent ready indicator (opponent has selected)
    function showOpponentReadyIndicator() {
        // Remove if already exists
        let indicatorEl = document.querySelector('.opponent-ready-indicator');
        if (!indicatorEl) {
            indicatorEl = document.createElement('div');
            indicatorEl.className = 'opponent-ready-indicator';
            indicatorEl.innerHTML = `
                <span class="ready-icon">✅</span>
                <p>あいてがえらびました！</p>
            `;
            selectionScreen.insertBefore(indicatorEl, selectionScreen.firstChild);
        }
        instructionText.textContent = 'あなたもえらぼう！';
    }

    // Send pokemon selection to peer
    function sendPokemonSelection(pokemon) {
        if (conn && isOnlineMode) {
            // Get name from correct input based on role
            const nameInput = isHost ? player1NameInput : player2NameInput;
            const defaultName = isHost ? 'トレーナー 1' : 'トレーナー 2';
            const myName = nameInput.value.trim() || defaultName;

            conn.send({
                type: 'pokemon_selected',
                pokemon: {
                    id: pokemon.id,
                    name: pokemon.name,
                    types: pokemon.types,
                    image: pokemon.image
                },
                playerName: myName
            });
        }
    }

    // Apply game settings from host
    function applyGameSettings(settings) {
        if (settings.mode) {
            document.getElementById('mode-select').value = settings.mode;
            handleModeChange({ target: { value: settings.mode }, fromPeer: true });
        }
        if (settings.region) {
            document.getElementById('region-filter').value = settings.region;
            handleRegionChange({ target: { value: settings.region }, fromPeer: true });
        }
        if (settings.type1) {
            document.getElementById('type1-filter').value = settings.type1;
            handleType1Change({ target: { value: settings.type1 }, fromPeer: true });
        }
        if (settings.type2) {
            document.getElementById('type2-filter').value = settings.type2;
            handleType2Change({ target: { value: settings.type2 }, fromPeer: true });
        }

        if (settings.ruleRegions) {
            ruleRegions = settings.ruleRegions;
            const container = document.getElementById('rule-region-checkboxes');
            if (container) {
                container.querySelectorAll('input').forEach(cb => {
                    cb.checked = ruleRegions.includes(cb.value);
                });
                updateBulkButtonLabel('rule-region-checkboxes');
            }
        }
        if (settings.ruleTypes) {
            ruleTypes = settings.ruleTypes;
            const container = document.getElementById('rule-type-checkboxes');
            if (container) {
                container.querySelectorAll('input').forEach(cb => {
                    cb.checked = ruleTypes.includes(cb.value);
                });
                updateBulkButtonLabel('rule-type-checkboxes');
            }
        }

        // Sync Type Mode Rules
        if (settings.battleRule !== undefined) {
            applyBattleRuleChange(settings.battleRule === 'double');
        }
        if (settings.constraint !== undefined) {
            applyConstraintChange(settings.constraint);
        }
        if (settings.calcMethod !== undefined) {
            applyCalcMethodChange(settings.calcMethod);
        }

        syncSelectionFiltersWithRules();
    }

    // Send current settings to peer (Host -> Guest on connect)
    function sendCurrentSettings() {
        if (!isHost || !conn) return;

        const settings = {
            mode: currentMode,
            region: currentRegionFilter,
            type1: currentType1Filter,
            type2: currentType2Filter,
            ruleRegions: ruleRegions,
            ruleTypes: ruleTypes,
            battleRule: typeBattleMode,
            constraint: isDoubleTypeRequired,
            calcMethod: damageCalculationMethod
        };
        conn.send({ type: 'game_settings', settings: settings });
    }

    // Apply settings change from peer (real-time sync)
    function applySettingsChange(data) {
        const modeSelect = document.getElementById('mode-select');
        const regionFilter = document.getElementById('region-filter');
        const type1Filter = document.getElementById('type1-filter');
        const type2Filter = document.getElementById('type2-filter');

        if (data.mode && modeSelect) {
            modeSelect.value = data.mode;
            handleModeChange({ target: { value: data.mode }, fromPeer: true });
        }
        if (data.region && regionFilter) {
            regionFilter.value = data.region;
            handleRegionChange({ target: { value: data.region }, fromPeer: true });
        }
        if (data.type1 && type1Filter) {
            type1Filter.value = data.type1;
            handleType1Change({ target: { value: data.type1 }, fromPeer: true });
        }
        if (data.type2 && type2Filter) {
            type2Filter.value = data.type2;
            handleType2Change({ target: { value: data.type2 }, fromPeer: true });
        }

        // Sync type mode rules
        if (data.battleRule !== undefined) {
            const toggle = document.getElementById('battle-rule-toggle');
            if (toggle) {
                toggle.checked = (data.battleRule === 'double');
                // Manually trigger the logic without re-sending
                applyBattleRuleChange(toggle.checked);
            }
        }
        if (data.constraint !== undefined) {
            const toggle = document.getElementById('constraint-toggle');
            if (toggle) {
                toggle.checked = data.constraint;
                isDoubleTypeRequired = data.constraint;
                updateToggleLabels('constraint-toggle');
            }
        }

        // Sync mandatory rules
        if (data.ruleRegions !== undefined) {
            ruleRegions = data.ruleRegions;
            const container = document.getElementById('rule-region-checkboxes');
            if (container) {
                container.querySelectorAll('input').forEach(cb => {
                    cb.checked = ruleRegions.includes(cb.value);
                });
            }
            syncSelectionFiltersWithRules();
        }
        if (data.ruleTypes !== undefined) {
            ruleTypes = data.ruleTypes;
            const container = document.getElementById('rule-type-checkboxes');
            if (container) {
                container.querySelectorAll('input').forEach(cb => {
                    cb.checked = ruleTypes.includes(cb.value);
                });
            }
            syncSelectionFiltersWithRules();
        }
    }

    // Send settings change to peer (called by host or guest)
    function sendSettingsChange(settingType, value) {
        if (isOnlineMode && conn) {
            const data = { type: 'rule_changed' };
            data[settingType] = value;
            conn.send(data);
        }
    }

    // --- Online Mode Event Listeners ---
    if (localModeBtn) {
        localModeBtn.addEventListener('click', () => {
            window.scrollTo(0, 0);
            isOnlineMode = false;
            showRuleSettingScreen();
        });
    }

    if (onlineModeBtn) {
        onlineModeBtn.addEventListener('click', () => {
            window.scrollTo(0, 0);
            modeSelectionScreen.classList.remove('active');
            modeSelectionScreen.classList.add('hidden');
            onlineRoomScreen.classList.remove('hidden');
            onlineRoomScreen.classList.add('active');
            instructionText.textContent = 'はなれたともだちとあそぼう！';
        });
    }

    if (backToModeBtn) {
        backToModeBtn.addEventListener('click', () => {
            window.scrollTo(0, 0);
            cancelConnection();
            onlineRoomScreen.classList.remove('active');
            onlineRoomScreen.classList.add('hidden');
            modeSelectionScreen.classList.remove('hidden');
            modeSelectionScreen.classList.add('active');
            instructionText.textContent = 'バトルモードをえらぼう！';

            // Reset Create Room UI
            const createdRoomIdInput = document.getElementById('created-room-id-input');
            const createRoomBtn = document.getElementById('create-room-btn');
            if (createdRoomIdInput) {
                // createdRoomIdInput.style.display = 'none'; // Always visible now
                createdRoomIdInput.value = '';
            }
            if (createRoomBtn) {
                createRoomBtn.textContent = 'おへやをつくる';
                createRoomBtn.style.background = ''; // Reset background
                createRoomBtn.classList.add('create-btn');
            }
        });
    }

    if (createRoomBtn) {
        createRoomBtn.addEventListener('click', createRoom);
    }

    if (joinRoomBtn) {
        joinRoomBtn.addEventListener('click', () => {
            const val = roomIdInput.value.trim().toUpperCase();
            joinRoom(val);
        });
    }

    if (copyRoomIdBtn) {
        copyRoomIdBtn.addEventListener('click', () => {
            if (!roomId) return;

            // Fallback function for older browsers or non-secure contexts
            const fallbackCopyTextToClipboard = (text) => {
                const textArea = document.createElement("textarea");
                textArea.value = text;

                // Avoid scrolling to bottom
                textArea.style.top = "0";
                textArea.style.left = "0";
                textArea.style.position = "fixed";

                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                    const successful = document.execCommand('copy');
                    if (successful) {
                        copyRoomIdBtn.textContent = 'コピーしました！';
                        setTimeout(() => {
                            copyRoomIdBtn.textContent = 'コピー';
                        }, 2000);
                    } else {
                        alert('コピーできませんでした。手動でコピーしてください: ' + text);
                    }
                } catch (err) {
                    alert('コピーできませんでした。手動でコピーしてください: ' + text);
                }

                document.body.removeChild(textArea);
            };

            if (!navigator.clipboard) {
                fallbackCopyTextToClipboard(roomId);
                return;
            }

            navigator.clipboard.writeText(roomId).then(() => {
                copyRoomIdBtn.textContent = 'コピーしました！';
                setTimeout(() => {
                    copyRoomIdBtn.textContent = 'コピー';
                }, 2000);
            }).catch(err => {
                console.error('Async: Could not copy text: ', err);
                fallbackCopyTextToClipboard(roomId);
            });
        });
    }

    if (cancelConnectionBtn) {
        cancelConnectionBtn.addEventListener('click', cancelConnection);
    }



    // -- Data --
    const pokemonData = [
        // Generation 1
        { id: 1, name: 'フシギダネ', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png' },
        { id: 2, name: 'フシギソウ', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png' },
        { id: 3, name: 'フシギバナ', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png' },
        { id: 10003, name: 'メガフシギバナ', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10033.png' },
        { id: 4, name: 'ヒトカゲ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png' },
        { id: 5, name: 'リザード', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/5.png' },
        { id: 6, name: 'リザードン', types: ['fire', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png' },
        { id: 10006, name: 'メガリザードンX', types: ['fire', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10034.png' },
        { id: 10006, name: 'メガリザードンY', types: ['fire', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10035.png' },
        { id: 7, name: 'ゼニガメ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png' },
        { id: 8, name: 'カメール', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/8.png' },
        { id: 9, name: 'カメックス', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png' },
        { id: 10009, name: 'メガカメックス', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10036.png' },
        { id: 10, name: 'キャタピー', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10.png' },
        { id: 11, name: 'トランセル', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/11.png' },
        { id: 12, name: 'バタフリー', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/12.png' },
        { id: 13, name: 'ビードル', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/13.png' },
        { id: 14, name: 'コクーン', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/14.png' },
        { id: 15, name: 'スピアー', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/15.png' },
        { id: 10015, name: 'メガスピアー', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10090.png' },
        { id: 16, name: 'ポッポ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/16.png' },
        { id: 17, name: 'ピジョン', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/17.png' },
        { id: 18, name: 'ピジョット', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png' },
        { id: 10018, name: 'メガピジョット', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10073.png' },
        { id: 19, name: 'コラッタ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/19.png' },
        { id: 29, name: 'コラッタ(アローラのすがた)', types: ['dark', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10091.png' },
        { id: 20, name: 'ラッタ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/20.png' },
        { id: 20, name: 'ラッタ(アローラのすがた)', types: ['dark', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10092.png' },
        { id: 21, name: 'オニスズメ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/21.png' },
        { id: 22, name: 'オニドリル', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/22.png' },
        { id: 23, name: 'アーボ', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/23.png' },
        { id: 24, name: 'アーボック', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/24.png' },
        { id: 25, name: 'ピカチュウ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' },
        { id: 26, name: 'ライチュウ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png' },
        { id: 26, name: 'ライチュウ(アローラのすがた)', types: ['electric', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10100.png' },
        { id: 10026, name: 'メガライチュウX', types: ['electric'], image: 'images/mega_raichu_x.png' },
        { id: 10026, name: 'メガライチュウY', types: ['electric'], image: 'images/mega_raichu_y.png' },
        { id: 27, name: 'サンド', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/27.png' },
        { id: 27, name: 'サンド(アローラのすがた)', types: ['ice', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10101.png' },
        { id: 28, name: 'サンドパン', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/28.png' },
        { id: 28, name: 'サンドパン(アローラのすがた)', types: ['ice', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10102.png' },
        { id: 29, name: 'ニドラン♀', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/29.png' },
        { id: 30, name: 'ニドリーナ', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/30.png' },
        { id: 31, name: 'ニドクイン', types: ['poison', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/31.png' },
        { id: 32, name: 'ニドラン♂', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/32.png' },
        { id: 33, name: 'ニドリーノ', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/33.png' },
        { id: 34, name: 'ニドキング', types: ['poison', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/34.png' },
        { id: 35, name: 'ピッピ', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/35.png' },
        { id: 36, name: 'ピクシー', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/36.png' },
        { id: 10036, name: 'メガピクシー', types: ['fairy', 'flying'], image: 'images/mega_clefable.png' },
        { id: 37, name: 'ロコン', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/37.png' },
        { id: 37, name: 'ロコン(アローラのすがた)', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10103.png' },
        { id: 38, name: 'キュウコン', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/38.png' },
        { id: 38, name: 'キュウコン(アローラのすがた)', types: ['ice', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10104.png' },
        { id: 39, name: 'プリン', types: ['normal', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png' },
        { id: 40, name: 'プクリン', types: ['normal', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/40.png' },
        { id: 41, name: 'ズバット', types: ['poison', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/41.png' },
        { id: 42, name: 'ゴルバット', types: ['poison', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/42.png' },
        { id: 43, name: 'ナゾノクサ', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/43.png' },
        { id: 44, name: 'クサイハナ', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/44.png' },
        { id: 45, name: 'ラフレシア', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/45.png' },
        { id: 46, name: 'パラス', types: ['bug', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/46.png' },
        { id: 47, name: 'パラセクト', types: ['bug', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/47.png' },
        { id: 48, name: 'コンパン', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/48.png' },
        { id: 49, name: 'モルフォン', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/49.png' },
        { id: 50, name: 'ディグダ', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/50.png' },
        { id: 50, name: 'ディグダ(アローラのすがた)', types: ['ground', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10105.png' },
        { id: 51, name: 'ダグトリオ', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/51.png' },
        { id: 51, name: 'ダグトリオ(アローラのすがた)', types: ['ground', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10106.png' },
        { id: 52, name: 'ニャース', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png' },
        { id: 52, name: 'ニャース(アローラのすがた)', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10107.png' },
        { id: 52, name: 'ニャース(ガラル)', types: ['steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10161.png' },
        { id: 53, name: 'ペルシアン', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/53.png' },
        { id: 53, name: 'ペルシアン(アローラのすがた)', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10108.png' },
        { id: 54, name: 'コダック', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png' },
        { id: 55, name: 'ゴルダック', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/55.png' },
        { id: 56, name: 'マンキー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/56.png' },
        { id: 57, name: 'オコリザル', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/57.png' },
        { id: 58, name: 'ガーディ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/58.png' },
        { id: 58, name: 'ガーディ(ヒスイのすがた)', types: ['fire', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10229.png' },
        { id: 59, name: 'ウインディ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/59.png' },
        { id: 59, name: 'ウインディ(ヒスイのすがた)', types: ['fire', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10230.png' },
        { id: 60, name: 'ニョロモ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/60.png' },
        { id: 61, name: 'ニョロゾ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/61.png' },
        { id: 62, name: 'ニョロボン', types: ['water', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/62.png' },
        { id: 63, name: 'ケーシィ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/63.png' },
        { id: 64, name: 'ユンゲラー', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/64.png' },
        { id: 65, name: 'フーディン', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/65.png' },
        { id: 10065, name: 'メガフーディン', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10037.png' },
        { id: 66, name: 'ワンリキー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/66.png' },
        { id: 67, name: 'ゴーリキー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/67.png' },
        { id: 68, name: 'カイリキー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/68.png' },
        { id: 69, name: 'マダツボミ', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/69.png' },
        { id: 70, name: 'ウツドン', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/70.png' },
        { id: 71, name: 'ウツボット', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/71.png' },
        { id: 10071, name: 'メガウツボット', types: ['grass', 'poison'], image: 'images/mega_victreebel.png' },
        { id: 72, name: 'メノクラゲ', types: ['water', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/72.png' },
        { id: 73, name: 'ドククラゲ', types: ['water', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/73.png' },
        { id: 74, name: 'イシツブテ', types: ['rock', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/74.png' },
        { id: 74, name: 'イシツブテ(アローラのすがた)', types: ['rock', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10109.png' },
        { id: 75, name: 'ゴローン', types: ['rock', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/75.png' },
        { id: 75, name: 'ゴローン(アローラのすがた)', types: ['rock', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10110.png' },
        { id: 76, name: 'ゴローニャ', types: ['rock', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/76.png' },
        { id: 76, name: 'ゴローニャ(アローラのすがた)', types: ['rock', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10111.png' },
        { id: 77, name: 'ポニータ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/77.png' },
        { id: 77, name: 'ポニータ(ガラルのすがた)', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10162.png' },
        { id: 78, name: 'ギャロップ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/78.png' },
        { id: 78, name: 'ギャロップ(ガラルのすがた)', types: ['psychic', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10163.png' },
        { id: 79, name: 'ヤドン', types: ['water', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/79.png' },
        { id: 79, name: 'ヤドン(ガラルのすがた)', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10164.png' },
        { id: 80, name: 'ヤドラン', types: ['water', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/80.png' },
        { id: 10080, name: 'メガヤドラン', types: ['water', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10071.png' },
        { id: 80, name: 'ヤドラン(ガラルのすがた)', types: ['poison', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10165.png' },
        { id: 81, name: 'コイル', types: ['electric', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/81.png' },
        { id: 82, name: 'レアコイル', types: ['electric', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/82.png' },
        { id: 83, name: 'カモネギ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/83.png' },
        { id: 83, name: 'カモネギ(ガラルのすがた)', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10166.png' },
        { id: 84, name: 'ドードー', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/84.png' },
        { id: 85, name: 'ドードリオ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/85.png' },
        { id: 86, name: 'パウワウ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/86.png' },
        { id: 87, name: 'ジュゴン', types: ['water', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/87.png' },
        { id: 88, name: 'ベトベター', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/88.png' },
        { id: 88, name: 'ベトベター(アローラのすがた)', types: ['poison', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10112.png' },
        { id: 89, name: 'ベトベトン', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/89.png' },
        { id: 89, name: 'ベトベトン(アローラのすがた)', types: ['poison', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10113.png' },
        { id: 90, name: 'シェルダー', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/90.png' },
        { id: 91, name: 'パルシェン', types: ['water', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/91.png' },
        { id: 92, name: 'ゴース', types: ['ghost', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/92.png' },
        { id: 93, name: 'ゴースト', types: ['ghost', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/93.png' },
        { id: 94, name: 'ゲンガー', types: ['ghost', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png' },
        { id: 10094, name: 'メガゲンガー', types: ['ghost', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10038.png' },
        { id: 95, name: 'イワーク', types: ['rock', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/95.png' },
        { id: 96, name: 'スリープ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/96.png' },
        { id: 97, name: 'スリーパー', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/97.png' },
        { id: 98, name: 'クラブ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/98.png' },
        { id: 99, name: 'キングラー', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/99.png' },
        { id: 100, name: 'ビリリダマ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/100.png' },
        { id: 100, name: 'ビリリダマ(ヒスイのすがた)', types: ['electric', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10231.png' },
        { id: 101, name: 'マルマイン', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/101.png' },
        { id: 102, name: 'マルマイン(ヒスイのすがた)', types: ['electric', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10232.png' },
        { id: 102, name: 'タマタマ', types: ['grass', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/102.png' },
        { id: 103, name: 'ナッシー', types: ['grass', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/103.png' },
        { id: 103, name: 'ナッシー(アローラのすがた)', types: ['grass', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10114.png' },
        { id: 104, name: 'カラカラ', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/104.png' },
        { id: 105, name: 'ガラガラ', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/105.png' },
        { id: 105, name: 'ガラガラ(アローラのすがた)', types: ['fire', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10115.png' },
        { id: 106, name: 'サワムラー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/106.png' },
        { id: 107, name: 'エビワラー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/107.png' },
        { id: 108, name: 'ベロリンガ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/108.png' },
        { id: 109, name: 'ドガース', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/109.png' },
        { id: 110, name: 'マタドガス', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/110.png' },
        { id: 110, name: 'マタドガス(ガラルのすがた)', types: ['poison', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10167.png' },
        { id: 111, name: 'サイホーン', types: ['ground', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/111.png' },
        { id: 112, name: 'サイドン', types: ['ground', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/112.png' },
        { id: 113, name: 'ラッキー', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/113.png' },
        { id: 114, name: 'モンジャラ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/114.png' },
        { id: 115, name: 'ガルーラ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/115.png' },
        { id: 10115, name: 'メガガルーラ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10039.png' },
        { id: 116, name: 'タッツー', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/116.png' },
        { id: 117, name: 'シードラ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/117.png' },
        { id: 118, name: 'トサキント', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/118.png' },
        { id: 119, name: 'アズマオウ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/119.png' },
        { id: 120, name: 'ヒトデマン', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/120.png' },
        { id: 121, name: 'スターミー', types: ['water', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/121.png' },
        { id: 10121, name: 'メガスターミー', types: ['water', 'psychic'], image: 'images/mega_starmie.png' },
        { id: 122, name: 'バリヤード', types: ['psychic', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/122.png' },
        { id: 122, name: 'バリヤード(ガラルのすがた)', types: ['ice', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10168.png' },
        { id: 123, name: 'ストライク', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/123.png' },
        { id: 124, name: 'ルージュラ', types: ['ice', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/124.png' },
        { id: 125, name: 'エレブー', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/125.png' },
        { id: 126, name: 'ブーバー', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/126.png' },
        { id: 127, name: 'カイロス', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/127.png' },
        { id: 10127, name: 'メガカイロス', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10040.png' },
        { id: 128, name: 'ケンタロス', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/128.png' },
        { id: 128, name: 'ケンタロス(パルデアのすがた・コンバットしゅ)', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10250.png' },
        { id: 128, name: 'ケンタロス(パルデアのすがた・ブレイズしゅ)', types: ['fighting', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10251.png' },
        { id: 128, name: 'ケンタロス(パルデアのすがた・ウォーターしゅ)', types: ['fighting', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10252.png' },
        { id: 129, name: 'コイキング', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/129.png' },
        { id: 130, name: 'ギャラドス', types: ['water', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png' },
        { id: 10130, name: 'メガギャラドス', types: ['water', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10041.png' },
        { id: 131, name: 'ラプラス', types: ['water', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/131.png' },
        { id: 132, name: 'メタモン', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png' },
        { id: 133, name: 'イーブイ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png' },
        { id: 134, name: 'シャワーズ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/134.png' },
        { id: 135, name: 'サンダース', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/135.png' },
        { id: 136, name: 'ブースター', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/136.png' },
        { id: 137, name: 'ポリゴン', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/137.png' },
        { id: 138, name: 'オムナイト', types: ['rock', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/138.png' },
        { id: 139, name: 'オムスター', types: ['rock', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/139.png' },
        { id: 140, name: 'カブト', types: ['rock', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/140.png' },
        { id: 141, name: 'カブトプス', types: ['rock', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/141.png' },
        { id: 142, name: 'プテラ', types: ['rock', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/142.png' },
        { id: 10142, name: 'メガプテラ', types: ['rock', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10042.png' },
        { id: 143, name: 'カビゴン', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png' },
        { id: 144, name: 'フリーザー', types: ['ice', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/144.png' },
        { id: 144, name: 'フリーザー(ガラルのすがた)', types: ['psychic', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10169.png' },
        { id: 145, name: 'サンダー', types: ['electric', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/145.png' },
        { id: 145, name: 'サンダー(ガラルのすがた)', types: ['fighting', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10170.png' },
        { id: 146, name: 'ファイヤー', types: ['fire', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/146.png' },
        { id: 146, name: 'ファイヤー(ガラルのすがた)', types: ['dark', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10171.png' },
        { id: 147, name: 'ミニリュウ', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/147.png' },
        { id: 148, name: 'ハクリュー', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/148.png' },
        { id: 149, name: 'カイリュー', types: ['dragon', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png' },
        { id: 10149, name: 'メガカイリュー', types: ['dragon', 'flying'], image: 'images/mega_dragonite.png' },
        { id: 150, name: 'ミュウツー', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png' },
        { id: 10150, name: 'メガミュウツーX', types: ['psychic', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10043.png' },
        { id: 10151, name: 'メガミュウツーY', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10044.png' },
        { id: 151, name: 'ミュウ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png' },
        // Generation 2
        { id: 152, name: 'チコリータ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/152.png' },
        { id: 153, name: 'ベイリーフ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/153.png' },
        { id: 154, name: 'メガニウム', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/154.png' },
        { id: 10154, name: 'メガメガニウム', types: ['grass', 'fairy'], image: 'images/mega_meganium.png' },
        { id: 155, name: 'ヒノアラシ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/155.png' },
        { id: 156, name: 'マグマラシ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/156.png' },
        { id: 157, name: 'バクフーン', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/157.png' },
        { id: 157, name: 'バクフーン(ヒスイのすがた)', types: ['fire', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10233.png' },
        { id: 158, name: 'ワニノコ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/158.png' },
        { id: 159, name: 'アリゲイツ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/159.png' },
        { id: 160, name: 'オーダイル', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/160.png' },
        { id: 10160, name: 'メガオーダイル', types: ['water', 'dragon'], image: 'images/mega_feraligatr.png' },
        { id: 161, name: 'オタチ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/161.png' },
        { id: 162, name: 'オオタチ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/162.png' },
        { id: 163, name: 'ホーホー', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/163.png' },
        { id: 164, name: 'ヨルノズク', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/164.png' },
        { id: 165, name: 'レディバ', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/165.png' },
        { id: 166, name: 'レディアン', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/166.png' },
        { id: 167, name: 'イトマル', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/167.png' },
        { id: 168, name: 'アリアドス', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/168.png' },
        { id: 169, name: 'クロバット', types: ['poison', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/169.png' },
        { id: 170, name: 'チョンチー', types: ['water', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/170.png' },
        { id: 171, name: 'ランターン', types: ['water', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/171.png' },
        { id: 172, name: 'ピチュー', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/172.png' },
        { id: 173, name: 'ピィ', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/173.png' },
        { id: 174, name: 'ププリン', types: ['normal', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/174.png' },
        { id: 175, name: 'トゲピー', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/175.png' },
        { id: 176, name: 'トゲチック', types: ['fairy', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/176.png' },
        { id: 177, name: 'ネイティ', types: ['psychic', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/177.png' },
        { id: 178, name: 'ネイティオ', types: ['psychic', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/178.png' },
        { id: 179, name: 'メリープ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/179.png' },
        { id: 180, name: 'モココ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/180.png' },
        { id: 181, name: 'デンリュウ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/181.png' },
        { id: 10181, name: 'メガデンリュウ', types: ['electric', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10045.png' },
        { id: 182, name: 'キレイハナ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/182.png' },
        { id: 183, name: 'マリル', types: ['water', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/183.png' },
        { id: 184, name: 'マリルリ', types: ['water', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/184.png' },
        { id: 185, name: 'ウソッキー', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/185.png' },
        { id: 186, name: 'ニョロトノ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/186.png' },
        { id: 187, name: 'ハネッコ', types: ['grass', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/187.png' },
        { id: 188, name: 'ポポッコ', types: ['grass', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/188.png' },
        { id: 189, name: 'ワタッコ', types: ['grass', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/189.png' },
        { id: 190, name: 'エイパム', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/190.png' },
        { id: 191, name: 'ヒマナッツ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/191.png' },
        { id: 192, name: 'キマワリ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/192.png' },
        { id: 193, name: 'ヤンヤンマ', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/193.png' },
        { id: 194, name: 'ウパー', types: ['water', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/194.png' },
        { id: 194, name: 'ウパー(パルデアのすがた)', types: ['poison', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10253.png' },
        { id: 195, name: 'ヌオー', types: ['water', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/195.png' },
        { id: 196, name: 'エーフィ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/196.png' },
        { id: 197, name: 'ブラッキー', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/197.png' },
        { id: 198, name: 'ヤミカラス', types: ['dark', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/198.png' },
        { id: 199, name: 'ヤドキング', types: ['water', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/199.png' },
        { id: 199, name: 'ヤドキング(ガラルのすがた)', types: ['poison', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10172.png' },
        { id: 200, name: 'ムウマ', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/200.png' },
        { id: 201, name: 'アンノーン', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/201.png' },
        { id: 202, name: 'ソーナンス', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/202.png' },
        { id: 203, name: 'キリンリキ', types: ['normal', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/203.png' },
        { id: 204, name: 'クヌギダマ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/204.png' },
        { id: 205, name: 'フォレトス', types: ['bug', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/205.png' },
        { id: 206, name: 'ノコッチ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/206.png' },
        { id: 207, name: 'グライガー', types: ['ground', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/207.png' },
        { id: 208, name: 'ハガネール', types: ['steel', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/208.png' },
        { id: 10208, name: 'メガハガネール', types: ['steel', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10072.png' },
        { id: 209, name: 'ブルー', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/209.png' },
        { id: 210, name: 'グランブル', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/210.png' },
        { id: 211, name: 'ハリーセン', types: ['water', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/211.png' },
        { id: 211, name: 'ハリーセン(ヒスイのすがた)', types: ['dark', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10234.png' },
        { id: 212, name: 'ハッサム', types: ['bug', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/212.png' },
        { id: 10212, name: 'メガハッサム', types: ['bug', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10046.png' },
        { id: 213, name: 'ツボツボ', types: ['bug', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/213.png' },
        { id: 214, name: 'ヘラクロス', types: ['bug', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/214.png' },
        { id: 10214, name: 'メガヘラクロス', types: ['bug', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10047.png' },
        { id: 215, name: 'ニューラ', types: ['dark', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/215.png' },
        { id: 215, name: 'ニューラ(ヒスイのすがた)', types: ['fighting', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10235.png' },
        { id: 216, name: 'ヒメグマ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/216.png' },
        { id: 217, name: 'リングマ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/217.png' },
        { id: 218, name: 'マグマッグ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/218.png' },
        { id: 219, name: 'マグカルゴ', types: ['fire', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/219.png' },
        { id: 220, name: 'ウリムー', types: ['ice', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/220.png' },
        { id: 221, name: 'イノムー', types: ['ice', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/221.png' },
        { id: 222, name: 'サニーゴ', types: ['water', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/222.png' },
        { id: 222, name: 'サニーゴ(ガラルのすがた)', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10173.png' },
        { id: 223, name: 'テッポウオ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/223.png' },
        { id: 224, name: 'オクタン', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/224.png' },
        { id: 225, name: 'デリバード', types: ['ice', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/225.png' },
        { id: 226, name: 'マンタイン', types: ['water', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/226.png' },
        { id: 227, name: 'エアームド', types: ['steel', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/227.png' },
        { id: 10227, name: 'メガエアームド', types: ['steel', 'flying'], image: 'images/mega_skarmory.png' },
        { id: 228, name: 'デルビル', types: ['dark', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/228.png' },
        { id: 229, name: 'ヘルガー', types: ['dark', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/229.png' },
        { id: 10229, name: 'メガヘルガー', types: ['dark', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10048.png' },
        { id: 230, name: 'キングドラ', types: ['water', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/230.png' },
        { id: 231, name: 'ゴマゾウ', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/231.png' },
        { id: 232, name: 'ドンファン', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/232.png' },
        { id: 233, name: 'ポリゴン2', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/233.png' },
        { id: 234, name: 'オドシシ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/234.png' },
        { id: 235, name: 'ドーブル', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/235.png' },
        { id: 236, name: 'バルキー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/236.png' },
        { id: 237, name: 'カポエラー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/237.png' },
        { id: 238, name: 'ムチュール', types: ['ice', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/238.png' },
        { id: 239, name: 'エレキッド', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/239.png' },
        { id: 240, name: 'ブビィ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/240.png' },
        { id: 241, name: 'ミルタンク', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/241.png' },
        { id: 242, name: 'ハピナス', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/242.png' },
        { id: 243, name: 'ライコウ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/243.png' },
        { id: 244, name: 'エンテイ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/244.png' },
        { id: 245, name: 'スイクン', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/245.png' },
        { id: 246, name: 'ヨーギラス', types: ['rock', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/246.png' },
        { id: 247, name: 'サナギラス', types: ['rock', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/247.png' },
        { id: 248, name: 'バンギラス', types: ['rock', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/248.png' },
        { id: 10248, name: 'メガバンギラス', types: ['rock', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10049.png' },
        { id: 249, name: 'ルギア', types: ['psychic', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/249.png' },
        { id: 250, name: 'ホウオウ', types: ['fire', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/250.png' },
        { id: 251, name: 'セレビィ', types: ['psychic', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/251.png' },
        // Generation 3
        { id: 252, name: 'キモリ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/252.png' },
        { id: 253, name: 'ジュプトル', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/253.png' },
        { id: 254, name: 'ジュカイン', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/254.png' },
        { id: 10254, name: 'メガジュカイン', types: ['grass', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10065.png' },
        { id: 255, name: 'アチャモ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/255.png' },
        { id: 256, name: 'ワカシャモ', types: ['fire', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/256.png' },
        { id: 257, name: 'バシャーモ', types: ['fire', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/257.png' },
        { id: 10257, name: 'メガバシャーモ', types: ['fire', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10050.png' },
        { id: 258, name: 'ミズゴロウ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/258.png' },
        { id: 259, name: 'ヌマクロー', types: ['water', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/259.png' },
        { id: 260, name: 'ラグラージ', types: ['water', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/260.png' },
        { id: 10260, name: 'メガラグラージ', types: ['water', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10064.png' },
        { id: 261, name: 'ポチエナ', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/261.png' },
        { id: 262, name: 'グラエナ', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/262.png' },
        { id: 263, name: 'ジグザグマ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/263.png' },
        { id: 263, name: 'ジグザグマ(ガラルのすがた)', types: ['dark', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10174.png' },
        { id: 264, name: 'マッスグマ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/264.png' },
        { id: 264, name: 'マッスグマ(ガラルのすがた)', types: ['dark', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10175.png' },
        { id: 265, name: 'ケムッソ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/265.png' },
        { id: 266, name: 'カラサリス', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/266.png' },
        { id: 267, name: 'アゲハント', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/267.png' },
        { id: 268, name: 'マユルド', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/268.png' },
        { id: 269, name: 'ドクケイル', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/269.png' },
        { id: 270, name: 'ハスボー', types: ['water', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/270.png' },
        { id: 271, name: 'ハスブレロ', types: ['water', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/271.png' },
        { id: 272, name: 'ルンパッパ', types: ['water', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/272.png' },
        { id: 273, name: 'タネボー', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/273.png' },
        { id: 274, name: 'コノハナ', types: ['grass', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/274.png' },
        { id: 275, name: 'ダーテング', types: ['grass', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/275.png' },
        { id: 276, name: 'スバメ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/276.png' },
        { id: 277, name: 'オオスバメ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/277.png' },
        { id: 278, name: 'キャモメ', types: ['water', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/278.png' },
        { id: 279, name: 'ペリッパー', types: ['water', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/279.png' },
        { id: 280, name: 'ラルトス', types: ['psychic', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/280.png' },
        { id: 281, name: 'キルリア', types: ['psychic', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/281.png' },
        { id: 282, name: 'サーナイト', types: ['psychic', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/282.png' },
        { id: 10282, name: 'メガサーナイト', types: ['psychic', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10051.png' },
        { id: 283, name: 'アメタマ', types: ['bug', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/283.png' },
        { id: 284, name: 'アメモース', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/284.png' },
        { id: 285, name: 'キノココ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/285.png' },
        { id: 286, name: 'キノガッサ', types: ['grass', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/286.png' },
        { id: 287, name: 'ナマケロ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/287.png' },
        { id: 288, name: 'ヤルキモノ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/288.png' },
        { id: 289, name: 'ケッキング', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/289.png' },
        { id: 290, name: 'ツチニン', types: ['bug', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/290.png' },
        { id: 291, name: 'テッカニン', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/291.png' },
        { id: 292, name: 'ヌケニン', types: ['bug', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/292.png' },
        { id: 293, name: 'ゴニョニョ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/293.png' },
        { id: 294, name: 'ドゴーム', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/294.png' },
        { id: 295, name: 'バクオング', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/295.png' },
        { id: 296, name: 'マクノシタ', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/296.png' },
        { id: 297, name: 'ハリテヤマ', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/297.png' },
        { id: 298, name: 'ルリリ', types: ['normal', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/298.png' },
        { id: 299, name: 'ノズパス', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/299.png' },
        { id: 300, name: 'エネコ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/300.png' },
        { id: 301, name: 'エネコロロ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/301.png' },
        { id: 302, name: 'ヤミラミ', types: ['dark', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/302.png' },
        { id: 10302, name: 'メガヤミラミ', types: ['dark', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10066.png' },
        { id: 303, name: 'クチート', types: ['steel', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/303.png' },
        { id: 10303, name: 'メガクチート', types: ['steel', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10052.png' },
        { id: 304, name: 'ココドラ', types: ['steel', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/304.png' },
        { id: 305, name: 'コドラ', types: ['steel', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/305.png' },
        { id: 306, name: 'ボスゴドラ', types: ['steel', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/306.png' },
        { id: 10306, name: 'メガボスゴドラ', types: ['steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10053.png' },
        { id: 307, name: 'アサナン', types: ['fighting', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/307.png' },
        { id: 308, name: 'チャーレム', types: ['fighting', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/308.png' },
        { id: 10308, name: 'メガチャーレム', types: ['fighting', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10054.png' },
        { id: 309, name: 'ラクライ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/309.png' },
        { id: 310, name: 'ライボルト', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/310.png' },
        { id: 10310, name: 'メガライボルト', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10055.png' },
        { id: 311, name: 'プラスル', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/311.png' },
        { id: 312, name: 'マイナン', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/312.png' },
        { id: 313, name: 'バルビート', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/313.png' },
        { id: 314, name: 'イルミーゼ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/314.png' },
        { id: 315, name: 'ロゼリア', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/315.png' },
        { id: 316, name: 'ゴクリン', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/316.png' },
        { id: 317, name: 'マルノーム', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/317.png' },
        { id: 318, name: 'キバニア', types: ['water', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/318.png' },
        { id: 319, name: 'サメハダー', types: ['water', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/319.png' },
        { id: 10319, name: 'メガサメハダー', types: ['water', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10070.png' },
        { id: 320, name: 'ホエルコ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/320.png' },
        { id: 321, name: 'ホエルオー', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/321.png' },
        { id: 322, name: 'ドンメル', types: ['fire', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/322.png' },
        { id: 323, name: 'バクーダ', types: ['fire', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/323.png' },
        { id: 10323, name: 'メガバクーダ', types: ['fire', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10087.png' },
        { id: 324, name: 'コータス', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/324.png' },
        { id: 325, name: 'バネブー', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/325.png' },
        { id: 326, name: 'ブーピッグ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/326.png' },
        { id: 327, name: 'パッチール', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/327.png' },
        { id: 328, name: 'ナックラー', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/328.png' },
        { id: 329, name: 'ビブラーバ', types: ['ground', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/329.png' },
        { id: 330, name: 'フライゴン', types: ['ground', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/330.png' },
        { id: 331, name: 'サボネア', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/331.png' },
        { id: 332, name: 'ノクタス', types: ['grass', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/332.png' },
        { id: 333, name: 'チルット', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/333.png' },
        { id: 334, name: 'チルタリス', types: ['dragon', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/334.png' },
        { id: 10334, name: 'メガチルタリス', types: ['dragon', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10067.png' },
        { id: 335, name: 'ザングース', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/335.png' },
        { id: 336, name: 'ハブネーク', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/336.png' },
        { id: 337, name: 'ルナトーン', types: ['rock', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/337.png' },
        { id: 338, name: 'ソルロック', types: ['rock', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/338.png' },
        { id: 339, name: 'ドジョッチ', types: ['water', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/339.png' },
        { id: 340, name: 'ナマズン', types: ['water', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/340.png' },
        { id: 341, name: 'ヘイガニ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/341.png' },
        { id: 342, name: 'シザリガー', types: ['water', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/342.png' },
        { id: 343, name: 'ヤジロン', types: ['ground', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/343.png' },
        { id: 344, name: 'ネンドール', types: ['ground', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/344.png' },
        { id: 345, name: 'リリーラ', types: ['rock', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/345.png' },
        { id: 346, name: 'ユレイドル', types: ['rock', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/346.png' },
        { id: 347, name: 'アノプス', types: ['rock', 'bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/347.png' },
        { id: 348, name: 'アーマルド', types: ['rock', 'bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/348.png' },
        { id: 349, name: 'ヒンバス', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/349.png' },
        { id: 350, name: 'ミロカロス', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/350.png' },
        { id: 351, name: 'ポワルン', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/351.png' },
        { id: 351, name: 'ポワルン(たいようのすがた)', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10013.png' },
        { id: 351, name: 'ポワルン(あまみずのすがた)', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10014.png' },
        { id: 351, name: 'ポワルン(ゆきぐものすがた)', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10015.png' },
        { id: 352, name: 'カクレオン', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/352.png' },
        { id: 353, name: 'カゲボウズ', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/353.png' },
        { id: 354, name: 'ジュペッタ', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/354.png' },
        { id: 10354, name: 'メガジュペッタ', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10056.png' },
        { id: 355, name: 'ヨマワル', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/355.png' },
        { id: 356, name: 'サマヨール', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/356.png' },
        { id: 357, name: 'トロピウス', types: ['grass', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/357.png' },
        { id: 358, name: 'チリーン', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/358.png' },
        { id: 10358, name: 'メガチリーン', types: ['psychic', 'steel'], image: 'images/mega_chimecho.png' },
        { id: 359, name: 'アブソル', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/359.png' },
        { id: 10359, name: 'メガアブソル', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10057.png' },
        { id: 10359, name: 'メガアブソルZ', types: ['dark', 'ghost'], image: 'images/mega_absol_z.png' },
        { id: 360, name: 'ソーナノ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/360.png' },
        { id: 361, name: 'ユキワラシ', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/361.png' },
        { id: 362, name: 'オニゴーリ', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/362.png' },
        { id: 10362, name: 'メガオニゴーリ', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10074.png' },
        { id: 363, name: 'タマザラシ', types: ['ice', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/363.png' },
        { id: 364, name: 'トドグラー', types: ['ice', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/364.png' },
        { id: 365, name: 'トドゼルガ', types: ['ice', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/365.png' },
        { id: 366, name: 'パールル', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/366.png' },
        { id: 367, name: 'ハンテール', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/367.png' },
        { id: 368, name: 'サクラビス', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/368.png' },
        { id: 369, name: 'ジーランス', types: ['water', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/369.png' },
        { id: 370, name: 'ラブカス', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/370.png' },
        { id: 371, name: 'タツベイ', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/371.png' },
        { id: 372, name: 'コモルー', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/372.png' },
        { id: 373, name: 'ボーマンダ', types: ['dragon', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/373.png' },
        { id: 10373, name: 'メガボーマンダ', types: ['dragon', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10089.png' },
        { id: 374, name: 'ダンバル', types: ['steel', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/374.png' },
        { id: 375, name: 'メタング', types: ['steel', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/375.png' },
        { id: 376, name: 'メタグロス', types: ['steel', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/376.png' },
        { id: 10376, name: 'メガメタグロス', types: ['steel', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10076.png' },
        { id: 377, name: 'レジロック', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/377.png' },
        { id: 378, name: 'レジアイス', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/378.png' },
        { id: 379, name: 'レジスチル', types: ['steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/379.png' },
        { id: 380, name: 'ラティアス', types: ['dragon', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/380.png' },
        { id: 380, name: 'メガラティアス', types: ['dragon', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10062.png' },
        { id: 381, name: 'ラティオス', types: ['dragon', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/381.png' },
        { id: 381, name: 'メガラティオス', types: ['dragon', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10063.png' },
        { id: 382, name: 'カイオーガ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/382.png' },
        { id: 382, name: 'ゲンシカイオーガ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10077.png' },
        { id: 383, name: 'グラードン', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/383.png' },
        { id: 383, name: 'ゲンシグラードン', types: ['ground', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10078.png' },
        { id: 384, name: 'レックウザ', types: ['dragon', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png' },
        { id: 384, name: 'メガレックウザ', types: ['dragon', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10079.png' },
        { id: 385, name: 'ジラーチ', types: ['steel', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/385.png' },
        { id: 386, name: 'デオキシス', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/386.png' },
        // Generation 4
        { id: 387, name: 'ナエトル', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/387.png' },
        { id: 388, name: 'ハヤシガメ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/388.png' },
        { id: 389, name: 'ドダイトス', types: ['grass', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/389.png' },
        { id: 390, name: 'ヒコザル', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/390.png' },
        { id: 391, name: 'モウカザル', types: ['fire', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/391.png' },
        { id: 392, name: 'ゴウカザル', types: ['fire', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/392.png' },
        { id: 393, name: 'ポッチャマ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/393.png' },
        { id: 394, name: 'ポッタイシ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/394.png' },
        { id: 395, name: 'エンペルト', types: ['water', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/395.png' },
        { id: 396, name: 'ムックル', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/396.png' },
        { id: 397, name: 'ムクバード', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/397.png' },
        { id: 398, name: 'ムクホーク', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/398.png' },
        { id: 398, name: 'メガムクホーク', types: ['fighting', 'flying'], image: 'images/mega_staraptor.png' },
        { id: 399, name: 'ビッパ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/399.png' },
        { id: 400, name: 'ビーダル', types: ['normal', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/400.png' },
        { id: 401, name: 'コロボーシ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/401.png' },
        { id: 402, name: 'コロトック', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/402.png' },
        { id: 403, name: 'コリンク', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/403.png' },
        { id: 404, name: 'ルクシオ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/404.png' },
        { id: 405, name: 'レントラー', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/405.png' },
        { id: 406, name: 'スボミー', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/406.png' },
        { id: 407, name: 'ロズレイド', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/407.png' },
        { id: 408, name: 'ズガイドス', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/408.png' },
        { id: 409, name: 'ラムパルド', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/409.png' },
        { id: 410, name: 'タテトプス', types: ['rock', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/410.png' },
        { id: 411, name: 'トリデプス', types: ['rock', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/411.png' },
        { id: 412, name: 'ミノムッチ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/412.png' },
        { id: 413, name: 'ミノマダム(くさきのミノ)', types: ['bug', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/413.png' },
        { id: 413, name: 'ミノマダム(すなちのミノ)', types: ['bug', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10004.png' },
        { id: 413, name: 'ミノマダム(ゴミのミノ)', types: ['bug', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10005.png' },
        { id: 414, name: 'ガーメイル', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/414.png' },
        { id: 415, name: 'ミツハニー', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/415.png' },
        { id: 416, name: 'ビークイン', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/416.png' },
        { id: 417, name: 'パチリス', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/417.png' },
        { id: 418, name: 'ブイゼル', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/418.png' },
        { id: 419, name: 'フローゼル', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/419.png' },
        { id: 420, name: 'チェリンボ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/420.png' },
        { id: 421, name: 'チェリム', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/421.png' },
        { id: 422, name: 'カラナクシ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/422.png' },
        { id: 423, name: 'トリトドン', types: ['water', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/423.png' },
        { id: 424, name: 'エテボース', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/424.png' },
        { id: 425, name: 'フワンテ', types: ['ghost', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/425.png' },
        { id: 426, name: 'フワライド', types: ['ghost', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/426.png' },
        { id: 427, name: 'ミミロル', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/427.png' },
        { id: 428, name: 'ミミロップ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/428.png' },
        { id: 428, name: 'メガミミロップ', types: ['normal', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10088.png' },
        { id: 429, name: 'ムウマージ', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/429.png' },
        { id: 430, name: 'ドンカラス', types: ['dark', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/430.png' },
        { id: 431, name: 'ニャルマー', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/431.png' },
        { id: 432, name: 'ブニャット', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/432.png' },
        { id: 433, name: 'リーシャン', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/433.png' },
        { id: 434, name: 'スカンプー', types: ['poison', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/434.png' },
        { id: 435, name: 'スカタンク', types: ['poison', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/435.png' },
        { id: 436, name: 'ドーミラー', types: ['steel', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/436.png' },
        { id: 437, name: 'ドータクン', types: ['steel', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/437.png' },
        { id: 438, name: 'ウソハチ', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/438.png' },
        { id: 439, name: 'マネネ', types: ['psychic', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/439.png' },
        { id: 440, name: 'ピンプク', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/440.png' },
        { id: 441, name: 'ペラップ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/441.png' },
        { id: 442, name: 'ミカルゲ', types: ['ghost', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/442.png' },
        { id: 443, name: 'フカマル', types: ['dragon', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/443.png' },
        { id: 444, name: 'ガバイト', types: ['dragon', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/444.png' },
        { id: 445, name: 'ガブリアス', types: ['dragon', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/445.png' },
        { id: 445, name: 'メガガブリアス', types: ['dragon', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10058.png' },
        { id: 446, name: 'ゴンベ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/446.png' },
        { id: 447, name: 'リオル', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/447.png' },
        { id: 448, name: 'ルカリオ', types: ['fighting', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png' },
        { id: 448, name: 'メガルカリオ', types: ['fighting', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10059.png' },
        { id: 448, name: 'メガルカリオZ', types: ['fighting', 'steel'], image: 'images/mega_lucario_z.png' },
        { id: 449, name: 'ヒポポタス', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/449.png' },
        { id: 450, name: 'カバルドン', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/450.png' },
        { id: 451, name: 'スコルピ', types: ['poison', 'bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/451.png' },
        { id: 452, name: 'ドラピオン', types: ['poison', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/452.png' },
        { id: 453, name: 'グレッグル', types: ['poison', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/453.png' },
        { id: 454, name: 'ドクロッグ', types: ['poison', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/454.png' },
        { id: 455, name: 'マスキッパ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/455.png' },
        { id: 456, name: 'ケイコウオ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/456.png' },
        { id: 457, name: 'ネオラント', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/457.png' },
        { id: 458, name: 'タマンタ', types: ['water', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/458.png' },
        { id: 459, name: 'ユキカブリ', types: ['grass', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/459.png' },
        { id: 460, name: 'ユキノオー', types: ['grass', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/460.png' },
        { id: 460, name: 'メガユキノオー', types: ['grass', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10060.png' },
        { id: 461, name: 'マニューラ', types: ['dark', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/461.png' },
        { id: 462, name: 'ジバコイル', types: ['electric', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/462.png' },
        { id: 463, name: 'ベロベルト', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/463.png' },
        { id: 464, name: 'ドサイドン', types: ['ground', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/464.png' },
        { id: 465, name: 'モジャンボ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/465.png' },
        { id: 466, name: 'エレキブル', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/466.png' },
        { id: 467, name: 'ブーバーン', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/467.png' },
        { id: 468, name: 'トゲキッス', types: ['fairy', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/468.png' },
        { id: 469, name: 'メガヤンマ', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/469.png' },
        { id: 470, name: 'リーフィア', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/470.png' },
        { id: 471, name: 'グレイシア', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/471.png' },
        { id: 472, name: 'グライオン', types: ['ground', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/472.png' },
        { id: 473, name: 'マンムー', types: ['ice', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/473.png' },
        { id: 474, name: 'ポリゴンZ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/474.png' },
        { id: 475, name: 'エルレイド', types: ['psychic', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/475.png' },
        { id: 475, name: 'メガエルレイド', types: ['psychic', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10068.png' },
        { id: 476, name: 'ダイノーズ', types: ['rock', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/476.png' },
        { id: 477, name: 'ヨノワール', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/477.png' },
        { id: 478, name: 'ユキメノコ', types: ['ice', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/478.png' },
        { id: 478, name: 'メガユキメノコ', types: ['ice', 'ghost'], image: 'images/mega_froslass.png' },
        { id: 479, name: 'ロトム', types: ['electric', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/479.png' },
        { id: 479, name: 'ロトム(ヒートロトム)', types: ['electric', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10008.png' },
        { id: 479, name: 'ロトム(ウォッシュロトム)', types: ['electric', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10009.png' },
        { id: 479, name: 'ロトム(フロストロトム)', types: ['electric', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10010.png' },
        { id: 479, name: 'ロトム(スピンロトム)', types: ['electric', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10011.png' },
        { id: 479, name: 'ロトム(カットロトム)', types: ['electric', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10012.png' },
        { id: 480, name: 'ユクシー', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/480.png' },
        { id: 481, name: 'エムリット', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/481.png' },
        { id: 482, name: 'アグノム', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/482.png' },
        { id: 483, name: 'ディアルガ', types: ['steel', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/483.png' },
        { id: 484, name: 'パルキア', types: ['water', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/484.png' },
        { id: 485, name: 'ヒードラン', types: ['fire', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/485.png' },
        { id: 485, name: 'メガヒードラン', types: ['fire', 'steel'], image: 'images/mega_heatran.png' },
        { id: 486, name: 'レジギガス', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/486.png' },
        { id: 487, name: 'ギラティナ', types: ['ghost', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/487.png' },
        { id: 488, name: 'クレセリア', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/488.png' },
        { id: 489, name: 'フィオネ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/489.png' },
        { id: 490, name: 'マナフィ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/490.png' },
        { id: 491, name: 'ダークライ', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/491.png' },
        { id: 491, name: 'メガダークライ', types: ['dark'], image: 'images/mega_darkrai.png' },
        { id: 492, name: 'シェイミ(ランドフォルム)', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/492.png' },
        { id: 492, name: 'シェイミ(スカイフォルム)', types: ['grass', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10006.png' },
        { id: 493, name: 'アルセウス', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/493.png' },
        // Generation 5
        { id: 494, name: 'ビクティニ', types: ['psychic', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/494.png' },
        { id: 495, name: 'ツタージャ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/495.png' },
        { id: 496, name: 'ジャノビー', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/496.png' },
        { id: 497, name: 'ジャローダ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/497.png' },
        { id: 498, name: 'ポカブ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/498.png' },
        { id: 499, name: 'チャオブー', types: ['fire', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/499.png' },
        { id: 500, name: 'エンブオー', types: ['fire', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/500.png' },
        { id: 500, name: 'メガエンブオー', types: ['fire', 'fighting'], image: 'images/mega_emboar.png' },
        { id: 501, name: 'ミジュマル', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/501.png' },
        { id: 502, name: 'フタチマル', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/502.png' },
        { id: 503, name: 'ダイケンキ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/503.png' },
        { id: 503, name: 'ダイケンキ(ヒスイのすがた)', types: ['water', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10236.png' },
        { id: 504, name: 'ミネズミ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/504.png' },
        { id: 505, name: 'ミルホッグ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/505.png' },
        { id: 506, name: 'ヨーテリー', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/506.png' },
        { id: 507, name: 'ハーデリア', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/507.png' },
        { id: 508, name: 'ムーランド', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/508.png' },
        { id: 509, name: 'チョロネコ', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/509.png' },
        { id: 510, name: 'レパルダス', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/510.png' },
        { id: 511, name: 'ヤナップ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/511.png' },
        { id: 512, name: 'ヤナッキー', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/512.png' },
        { id: 513, name: 'バオップ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/513.png' },
        { id: 514, name: 'バオッキー', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/514.png' },
        { id: 515, name: 'ヒヤップ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/515.png' },
        { id: 516, name: 'ヒヤッキー', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/516.png' },
        { id: 517, name: 'ムンナ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/517.png' },
        { id: 518, name: 'ムシャーナ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/518.png' },
        { id: 519, name: 'マメパト', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/519.png' },
        { id: 520, name: 'ハトーボー', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/520.png' },
        { id: 521, name: 'ケンホロウ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/521.png' },
        { id: 522, name: 'シママ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/522.png' },
        { id: 523, name: 'ゼブライカ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/523.png' },
        { id: 524, name: 'ダンゴロ', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/524.png' },
        { id: 525, name: 'ガントル', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/525.png' },
        { id: 526, name: 'ギガイアス', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/526.png' },
        { id: 527, name: 'コロモリ', types: ['psychic', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/527.png' },
        { id: 528, name: 'ココロモリ', types: ['psychic', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/528.png' },
        { id: 529, name: 'モグリュー', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/529.png' },
        { id: 530, name: 'ドリュウズ', types: ['ground', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/530.png' },
        { id: 530, name: 'メガドリュウズ', types: ['ground', 'steel'], image: 'images/mega_excadrill.png' },
        { id: 531, name: 'タブンネ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/531.png' },
        { id: 531, name: 'メガタブンネ', types: ['normal', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10069.png' },
        { id: 532, name: 'ドッコラー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/532.png' },
        { id: 533, name: 'ドテッコツ', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/533.png' },
        { id: 534, name: 'ローブシン', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/534.png' },
        { id: 535, name: 'オタマロ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/535.png' },
        { id: 536, name: 'ガマガル', types: ['water', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/536.png' },
        { id: 537, name: 'ガマゲロゲ', types: ['water', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/537.png' },
        { id: 538, name: 'ナゲキ', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/538.png' },
        { id: 539, name: 'ダゲキ', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/539.png' },
        { id: 540, name: 'クルミル', types: ['bug', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/540.png' },
        { id: 541, name: 'クルマユ', types: ['bug', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/541.png' },
        { id: 542, name: 'ハハコモリ', types: ['bug', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/542.png' },
        { id: 543, name: 'フシデ', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/543.png' },
        { id: 544, name: 'ホイーガ', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/544.png' },
        { id: 545, name: 'ペンドラー', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/545.png' },
        { id: 545, name: 'メガペンドラー', types: ['bug', 'poison'], image: 'images/mega_scolipede.png' },
        { id: 546, name: 'モンメン', types: ['grass', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/546.png' },
        { id: 547, name: 'エルフーン', types: ['grass', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/547.png' },
        { id: 548, name: 'チュリネ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/548.png' },
        { id: 549, name: 'ドレディア', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/549.png' },
        { id: 549, name: 'ドレディア(ヒスイのすがた)', types: ['grass', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10237.png' },
        { id: 550, name: 'バスラオ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/550.png' },
        { id: 551, name: 'メグロコ', types: ['ground', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/551.png' },
        { id: 552, name: 'ワルビル', types: ['ground', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/552.png' },
        { id: 553, name: 'ワルビアル', types: ['ground', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/553.png' },
        { id: 554, name: 'ダルマッカ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/554.png' },
        { id: 554, name: 'ダルマッカ(ガラルのすがた)', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10176.png' },
        { id: 555, name: 'ヒヒダルマ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/555.png' },
        { id: 555, name: 'ヒヒダルマ(ダルマモード)', types: ['fire', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10017.png' },
        { id: 555, name: 'ヒヒダルマ(ガラルのすがた)', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10177.png' },
        { id: 555, name: 'ヒヒダルマ(ガラルのすがた)(ダルマモード)', types: ['ice', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10178.png' },
        { id: 556, name: 'マラカッチ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/556.png' },
        { id: 557, name: 'イシズマイ', types: ['bug', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/557.png' },
        { id: 558, name: 'イワパレス', types: ['bug', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/558.png' },
        { id: 559, name: 'ズルッグ', types: ['dark', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/559.png' },
        { id: 560, name: 'ズルズキン', types: ['dark', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/560.png' },
        { id: 560, name: 'メガズルズキン', types: ['dark', 'fighting'], image: 'images/mega_scrafty.png' },
        { id: 561, name: 'シンボラー', types: ['psychic', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/561.png' },
        { id: 562, name: 'デスマス', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/562.png' },
        { id: 562, name: 'デスマス(ガラルのすがた)', types: ['ground', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10179.png' },
        { id: 563, name: 'デスカーン', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/563.png' },
        { id: 564, name: 'プロトーガ', types: ['water', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/564.png' },
        { id: 565, name: 'アバゴーラ', types: ['water', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/565.png' },
        { id: 566, name: 'アーケン', types: ['rock', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/566.png' },
        { id: 567, name: 'アーケオス', types: ['rock', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/567.png' },
        { id: 568, name: 'ヤブクロン', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/568.png' },
        { id: 569, name: 'ダストダス', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/569.png' },
        { id: 570, name: 'ゾロア', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/570.png' },
        { id: 570, name: 'ゾロア(ヒスイのすがた)', types: ['normal', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10238.png' },
        { id: 571, name: 'ゾロアーク', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/571.png' },
        { id: 571, name: 'ゾロアーク(ヒスイのすがた)', types: ['normal', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10239.png' },
        { id: 572, name: 'チラーミィ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/572.png' },
        { id: 573, name: 'チラチーノ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/573.png' },
        { id: 574, name: 'ゴチム', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/574.png' },
        { id: 575, name: 'ゴチミル', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/575.png' },
        { id: 576, name: 'ゴチルゼル', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/576.png' },
        { id: 577, name: 'ユニラン', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/577.png' },
        { id: 578, name: 'ダブラン', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/578.png' },
        { id: 579, name: 'ランクルス', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/579.png' },
        { id: 580, name: 'コアルヒー', types: ['water', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/580.png' },
        { id: 581, name: 'スワンナ', types: ['water', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/581.png' },
        { id: 582, name: 'バニプッチ', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/582.png' },
        { id: 583, name: 'バニリッチ', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/583.png' },
        { id: 584, name: 'バイバニラ', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/584.png' },
        { id: 585, name: 'シキジカ', types: ['normal', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/585.png' },
        { id: 586, name: 'メブキジカ', types: ['normal', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/586.png' },
        { id: 587, name: 'エモンガ', types: ['electric', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/587.png' },
        { id: 588, name: 'カブルモ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/588.png' },
        { id: 589, name: 'シュバルゴ', types: ['bug', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/589.png' },
        { id: 590, name: 'タマゲタケ', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/590.png' },
        { id: 591, name: 'モロバレル', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/591.png' },
        { id: 592, name: 'プルリル', types: ['water', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/592.png' },
        { id: 593, name: 'ブルンゲル', types: ['water', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/593.png' },
        { id: 594, name: 'ママンボウ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/594.png' },
        { id: 595, name: 'バチュル', types: ['bug', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/595.png' },
        { id: 596, name: 'デンチュラ', types: ['bug', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/596.png' },
        { id: 597, name: 'テッシード', types: ['grass', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/597.png' },
        { id: 598, name: 'ナットレイ', types: ['grass', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/598.png' },
        { id: 599, name: 'ギアル', types: ['steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/599.png' },
        { id: 600, name: 'ギギアル', types: ['steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/600.png' },
        { id: 601, name: 'ギギギアル', types: ['steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/601.png' },
        { id: 602, name: 'シビシラス', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/602.png' },
        { id: 603, name: 'シビビール', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/603.png' },
        { id: 604, name: 'シビルドン', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/604.png' },
        { id: 604, name: 'メガシビルドン', types: ['electric'], image: 'images/mega_eelektross.png' },
        { id: 605, name: 'リグレー', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/605.png' },
        { id: 606, name: 'オーベム', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/606.png' },
        { id: 607, name: 'ヒトモシ', types: ['ghost', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/607.png' },
        { id: 608, name: 'ランプラー', types: ['ghost', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/608.png' },
        { id: 609, name: 'シャンデラ', types: ['ghost', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/609.png' },
        { id: 609, name: 'メガシャンデラ', types: ['ghost', 'fire'], image: 'images/mega_chandelure.png' },
        { id: 610, name: 'キバゴ', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/610.png' },
        { id: 611, name: 'オノンド', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/611.png' },
        { id: 612, name: 'オノノクス', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/612.png' },
        { id: 613, name: 'クマシュン', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/613.png' },
        { id: 614, name: 'ツンベアー', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/614.png' },
        { id: 615, name: 'フリージオ', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/615.png' },
        { id: 616, name: 'チョボマキ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/616.png' },
        { id: 617, name: 'アギルダー', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/617.png' },
        { id: 618, name: 'マッギョ', types: ['ground', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/618.png' },
        { id: 618, name: 'マッギョ(ガラルのすがた)', types: ['ground', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10180.png' },
        { id: 619, name: 'コジョフー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/619.png' },
        { id: 620, name: 'コジョンド', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/620.png' },
        { id: 621, name: 'クリムガン', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/621.png' },
        { id: 622, name: 'ゴビット', types: ['ground', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/622.png' },
        { id: 623, name: 'ゴルーグ', types: ['ground', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/623.png' },
        { id: 623, name: 'メガゴルーグ', types: ['ground', 'ghost'], image: 'images/mega_golurk.png' },
        { id: 624, name: 'コマタナ', types: ['dark', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/624.png' },
        { id: 625, name: 'キリキザン', types: ['dark', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/625.png' },
        { id: 626, name: 'バッフロン', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/626.png' },
        { id: 627, name: 'ワシボン', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/627.png' },
        { id: 628, name: 'ウォーグル', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/628.png' },
        { id: 628, name: 'ウォーグル(ヒスイのすがた)', types: ['psychic', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10240.png' },
        { id: 629, name: 'バルチャイ', types: ['dark', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/629.png' },
        { id: 630, name: 'バルジーナ', types: ['dark', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/630.png' },
        { id: 631, name: 'クイタラン', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/631.png' },
        { id: 632, name: 'アイアント', types: ['bug', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/632.png' },
        { id: 633, name: 'モノズ', types: ['dark', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/633.png' },
        { id: 634, name: 'ジヘッド', types: ['dark', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/634.png' },
        { id: 635, name: 'サザンドラ', types: ['dark', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/635.png' },
        { id: 636, name: 'メラルバ', types: ['bug', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/636.png' },
        { id: 637, name: 'ウルガモス', types: ['bug', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/637.png' },
        { id: 638, name: 'コバルオン', types: ['steel', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/638.png' },
        { id: 639, name: 'テラキオン', types: ['rock', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/639.png' },
        { id: 640, name: 'ビリジオン', types: ['grass', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/640.png' },
        { id: 641, name: 'トルネロス', types: ['flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/641.png' },
        { id: 642, name: 'ボルトロス', types: ['electric', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/642.png' },
        { id: 643, name: 'レシラム', types: ['dragon', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/643.png' },
        { id: 644, name: 'ゼクロム', types: ['dragon', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/644.png' },
        { id: 645, name: 'ランドロス', types: ['ground', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/645.png' },
        { id: 646, name: 'キュレム', types: ['dragon', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/646.png' },
        { id: 647, name: 'ケルディオ', types: ['water', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/647.png' },
        { id: 648, name: 'メロエッタ(ボイスフォルム)', types: ['normal', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/648.png' },
        { id: 648, name: 'メロエッタ(ステップフォルム)', types: ['normal', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10018.png' },
        { id: 649, name: 'ゲノセクト', types: ['bug', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/649.png' },
        // Generation 6
        { id: 650, name: 'ハリマロン', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/650.png' },
        { id: 651, name: 'ハリボーグ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/651.png' },
        { id: 652, name: 'ブリガロン', types: ['grass', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/652.png' },
        { id: 652, name: 'メガブリガロン', types: ['grass', 'fighting'], image: 'images/mega_chesnaught.png' },
        { id: 653, name: 'フォッコ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/653.png' },
        { id: 654, name: 'テールナー', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/654.png' },
        { id: 655, name: 'マフォクシー', types: ['fire', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/655.png' },
        { id: 655, name: 'メガマフォクシー', types: ['fire', 'psychic'], image: 'images/mega_delphox.png' },
        { id: 656, name: 'ケロマツ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/656.png' },
        { id: 657, name: 'ゲコガシラ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/657.png' },
        { id: 658, name: 'ゲッコウガ', types: ['water', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/658.png' },
        { id: 658, name: 'メガゲッコウガ', types: ['water', 'dark'], image: 'images/mega_greninja.png' },
        { id: 659, name: 'ホルビー', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/659.png' },
        { id: 660, name: 'ホルード', types: ['normal', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/660.png' },
        { id: 661, name: 'ヤヤコマ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/661.png' },
        { id: 662, name: 'ヒノヤコマ', types: ['fire', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/662.png' },
        { id: 663, name: 'ファイアロー', types: ['fire', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/663.png' },
        { id: 664, name: 'コフキムシ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/664.png' },
        { id: 665, name: 'コフーライ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/665.png' },
        { id: 666, name: 'ビビヨン', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/666.png' },
        { id: 667, name: 'シシコ', types: ['fire', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/667.png' },
        { id: 668, name: 'カエンジシ', types: ['fire', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/668.png' },
        { id: 668, name: 'メガカエンジシ', types: ['fire', 'normal'], image: 'images/mega_pyroar.png' },
        { id: 669, name: 'フラベベ', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/669.png' },
        { id: 670, name: 'フラエッテ', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/670.png' },
        { id: 670, name: 'メガフラエッテ', types: ['fairy'], image: 'images/mega_floette.png' },
        { id: 671, name: 'フラージェス', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/671.png' },
        { id: 672, name: 'メェークル', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/672.png' },
        { id: 673, name: 'ゴーゴート', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/673.png' },
        { id: 674, name: 'ヤンチャム', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/674.png' },
        { id: 675, name: 'ゴロンダ', types: ['fighting', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/675.png' },
        { id: 676, name: 'トリミアン', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/676.png' },
        { id: 677, name: 'ニャスパー', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/677.png' },
        { id: 678, name: 'ニャオニクス', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/678.png' },
        { id: 678, name: 'メガニャオニクス', types: ['psychic'], image: 'images/mega_meowstic.png' },
        { id: 679, name: 'ヒトツキ', types: ['steel', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/679.png' },
        { id: 680, name: 'ニダンギル', types: ['steel', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/680.png' },
        { id: 681, name: 'ギルガルド', types: ['steel', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/681.png' },
        { id: 682, name: 'シュシュプ', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/682.png' },
        { id: 683, name: 'フレフワン', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/683.png' },
        { id: 684, name: 'ペロッパフ', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/684.png' },
        { id: 685, name: 'ペロリーム', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/685.png' },
        { id: 686, name: 'マーイーカ', types: ['dark', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/686.png' },
        { id: 687, name: 'カラマネロ', types: ['dark', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/687.png' },
        { id: 687, name: 'メガカラマネロ', types: ['dark', 'psychic'], image: 'images/mega_malamar.png' },
        { id: 688, name: 'カメテテ', types: ['rock', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/688.png' },
        { id: 689, name: 'ガメノデス', types: ['rock', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/689.png' },
        { id: 689, name: 'メガガメノデス', types: ['rock', 'fighting'], image: 'images/mega_barbaracle.png' },
        { id: 690, name: 'クズモー', types: ['poison', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/690.png' },
        { id: 691, name: 'ドラミドロ', types: ['poison', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/691.png' },
        { id: 691, name: 'メガドラミドロ', types: ['poison', 'dragon'], image: 'images/mega_dragalge.png' },
        { id: 692, name: 'ウデッポウ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/692.png' },
        { id: 693, name: 'ブロスター', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/693.png' },
        { id: 694, name: 'エリキテル', types: ['electric', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/694.png' },
        { id: 695, name: 'エレザード', types: ['electric', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/695.png' },
        { id: 696, name: 'チゴラス', types: ['rock', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/696.png' },
        { id: 697, name: 'ガチゴラス', types: ['rock', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/697.png' },
        { id: 698, name: 'アマルス', types: ['rock', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/698.png' },
        { id: 699, name: 'アマルルガ', types: ['rock', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/699.png' },
        { id: 700, name: 'ニンフィア', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/700.png' },
        { id: 701, name: 'ルチャブル', types: ['fighting', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/701.png' },
        { id: 701, name: 'メガルチャブル', types: ['fighting', 'flying'], image: 'images/mega_hawlucha.png' },
        { id: 702, name: 'デデンネ', types: ['electric', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/702.png' },
        { id: 703, name: 'メレシー', types: ['rock', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/703.png' },
        { id: 704, name: 'ヌメラ', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/704.png' },
        { id: 705, name: 'ヌメイル', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/705.png' },
        { id: 705, name: 'ヌメイル(ヒスイのすがた)', types: ['steel', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10242.png' },
        { id: 706, name: 'ヌメルゴン', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/706.png' },
        { id: 706, name: 'ヌメルゴン(ヒスイのすがた)', types: ['steel', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10243.png' },
        { id: 707, name: 'クレッフィ', types: ['steel', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/707.png' },
        { id: 708, name: 'ボクレー', types: ['ghost', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/708.png' },
        { id: 709, name: 'オーロット', types: ['ghost', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/709.png' },
        { id: 710, name: 'バケッチャ', types: ['ghost', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/710.png' },
        { id: 711, name: 'パンプジン', types: ['ghost', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/711.png' },
        { id: 712, name: 'カチコール', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/712.png' },
        { id: 713, name: 'クレベース', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/713.png' },
        { id: 713, name: 'クレベース(ヒスイのすがた)', types: ['ice', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10244.png' },
        { id: 714, name: 'オンバット', types: ['flying', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/714.png' },
        { id: 715, name: 'オンバーン', types: ['flying', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/715.png' },
        { id: 716, name: 'ゼルネアス', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/716.png' },
        { id: 717, name: 'イベルタル', types: ['dark', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/717.png' },
        { id: 718, name: 'ジガルデ', types: ['dragon', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/718.png' },
        { id: 718, name: 'メガジガルデ', types: ['dragon', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10120.png' },
        { id: 719, name: 'ディアンシー', types: ['rock', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/719.png' },
        { id: 719, name: 'メガディアンシー', types: ['rock', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10075.png' },
        { id: 720, name: 'フーパ(いましめられしフーパ)', types: ['psychic', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/720.png' },
        { id: 720, name: 'フーパ(ときはなたれしフーパ)', types: ['psychic', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10076.png' },
        { id: 721, name: 'ボルケニオン', types: ['fire', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/721.png' },
        // Generation 7
        { id: 722, name: 'モクロー', types: ['grass', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/722.png' },
        { id: 723, name: 'フクスロー', types: ['grass', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/723.png' },
        { id: 724, name: 'ジュナイパー', types: ['grass', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/724.png' },
        { id: 724, name: 'ジュナイパー(ヒスイのすがた)', types: ['grass', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10244.png' },
        { id: 725, name: 'ニャビー', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/725.png' },
        { id: 726, name: 'ニャヒート', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/726.png' },
        { id: 727, name: 'ガオガエン', types: ['fire', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/727.png' },
        { id: 728, name: 'アシマリ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/728.png' },
        { id: 729, name: 'オシャマリ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/729.png' },
        { id: 730, name: 'アシレーヌ', types: ['water', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/730.png' },
        { id: 731, name: 'ツツケラ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/731.png' },
        { id: 732, name: 'ケララッパ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/732.png' },
        { id: 733, name: 'ドデカバシ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/733.png' },
        { id: 734, name: 'ヤングース', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/734.png' },
        { id: 735, name: 'デカグース', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/735.png' },
        { id: 736, name: 'アゴジムシ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/736.png' },
        { id: 737, name: 'デンヂムシ', types: ['bug', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/737.png' },
        { id: 738, name: 'クワガノン', types: ['bug', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/738.png' },
        { id: 739, name: 'マケンカニ', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/739.png' },
        { id: 740, name: 'ケケンカニ', types: ['fighting', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/740.png' },
        { id: 740, name: 'メガケケンカニ', types: ['fighting', 'ice'], image: 'images/mega_crabominable.png' },
        { id: 741, name: 'オドリドリ(めらめらスタイル)', types: ['fire', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/741.png' },
        { id: 741, name: 'オドリドリ(ぱちぱちスタイル)', types: ['electric', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10123.png' },
        { id: 741, name: 'オドリドリ(ふらふらスタイル)', types: ['psychic', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10124.png' },
        { id: 741, name: 'オドリドリ(まいまいスタイル)', types: ['ghost', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10125.png' },
        { id: 742, name: 'アブリー', types: ['bug', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/742.png' },
        { id: 743, name: 'アブリボン', types: ['bug', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/743.png' },
        { id: 744, name: 'イワンコ', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/744.png' },
        { id: 745, name: 'ルガルガン', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/745.png' },
        { id: 746, name: 'ヨワシ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/746.png' },
        { id: 747, name: 'ヒドイデ', types: ['poison', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/747.png' },
        { id: 748, name: 'ドヒドイデ', types: ['poison', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/748.png' },
        { id: 749, name: 'ドロバンコ', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/749.png' },
        { id: 750, name: 'バンバドロ', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/750.png' },
        { id: 751, name: 'シズクモ', types: ['water', 'bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/751.png' },
        { id: 752, name: 'オニシズクモ', types: ['water', 'bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/752.png' },
        { id: 753, name: 'カリキリ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/753.png' },
        { id: 754, name: 'ラランテス', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/754.png' },
        { id: 755, name: 'ネマシュ', types: ['grass', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/755.png' },
        { id: 756, name: 'マシェード', types: ['grass', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/756.png' },
        { id: 757, name: 'ヤトウモリ', types: ['poison', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/757.png' },
        { id: 758, name: 'エンニュート', types: ['poison', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/758.png' },
        { id: 759, name: 'ヌイコグマ', types: ['normal', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/759.png' },
        { id: 760, name: 'キテルグマ', types: ['normal', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/760.png' },
        { id: 761, name: 'アマカジ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/761.png' },
        { id: 762, name: 'アママイコ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/762.png' },
        { id: 763, name: 'アマージョ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/763.png' },
        { id: 764, name: 'キュワワー', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/764.png' },
        { id: 765, name: 'ヤレユータン', types: ['normal', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/765.png' },
        { id: 766, name: 'ナゲツケサル', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/766.png' },
        { id: 767, name: 'コソクムシ', types: ['bug', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/767.png' },
        { id: 768, name: 'グソクムシャ', types: ['bug', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/768.png' },
        { id: 768, name: 'メガグソクムシャ', types: ['bug', 'steel'], image: 'images/mega_golisopod.png' },
        { id: 769, name: 'スナバァ', types: ['ghost', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/769.png' },
        { id: 770, name: 'シロデスナ', types: ['ghost', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/770.png' },
        { id: 771, name: 'ナマコブシ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/771.png' },
        { id: 772, name: 'タイプ：ヌル', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/772.png' },
        { id: 773, name: 'シルヴァディ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/773.png' },
        { id: 774, name: 'メテノ', types: ['rock', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/774.png' },
        { id: 775, name: 'ネッコアラ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/775.png' },
        { id: 776, name: 'バクガメス', types: ['fire', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/776.png' },
        { id: 777, name: 'トゲデマル', types: ['electric', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/777.png' },
        { id: 778, name: 'ミミッキュ', types: ['ghost', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/778.png' },
        { id: 779, name: 'ハギギシリ', types: ['water', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/779.png' },
        { id: 780, name: 'ジジーロン', types: ['normal', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/780.png' },
        { id: 780, name: 'メガジジーロン', types: ['normal', 'dragon'], image: 'images/mega_drampa.png' },
        { id: 781, name: 'ダダリン', types: ['ghost', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/781.png' },
        { id: 782, name: 'ジャラコ', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/782.png' },
        { id: 783, name: 'ジャランゴ', types: ['dragon', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/783.png' },
        { id: 784, name: 'ジャラランガ', types: ['dragon', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/784.png' },
        { id: 785, name: 'カプ・コケコ', types: ['electric', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/785.png' },
        { id: 786, name: 'カプ・テテフ', types: ['psychic', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/786.png' },
        { id: 787, name: 'カプ・ブルル', types: ['grass', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/787.png' },
        { id: 788, name: 'カプ・レヒレ', types: ['water', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/788.png' },
        { id: 789, name: 'コスモッグ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/789.png' },
        { id: 790, name: 'コスモウム', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/790.png' },
        { id: 791, name: 'ソルガレオ', types: ['psychic', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/791.png' },
        { id: 792, name: 'ルナアーラ', types: ['psychic', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/792.png' },
        { id: 793, name: 'ウツロイド', types: ['rock', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/793.png' },
        { id: 794, name: 'マッシブーン', types: ['bug', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/794.png' },
        { id: 795, name: 'フェローチェ', types: ['bug', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/795.png' },
        { id: 796, name: 'デンジュモク', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/796.png' },
        { id: 797, name: 'テッカグヤ', types: ['steel', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/797.png' },
        { id: 798, name: 'カミツルギ', types: ['grass', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/798.png' },
        { id: 799, name: 'アクジキング', types: ['dark', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/799.png' },
        { id: 800, name: 'ネクロズマ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/800.png' },
        { id: 800, name: 'ネクロズマ(たそがれのたてがみ)', types: ['psychic', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10155.png' },
        { id: 800, name: 'ネクロズマ(あかつきのつばさ)', types: ['psychic', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10156.png' },
        { id: 800, name: 'ネクロズマ(ウルトラネクロズマ)', types: ['psychic', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10157.png' },
        { id: 801, name: 'マギアナ', types: ['steel', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/801.png' },
        { id: 801, name: 'メガマギアナ', types: ['steel', 'fairy'], image: 'images/mega_magearna.png' },
        { id: 802, name: 'マーシャドー', types: ['fighting', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/802.png' },
        { id: 803, name: 'ベベノム', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/803.png' },
        { id: 804, name: 'アーゴヨン', types: ['poison', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/804.png' },
        { id: 805, name: 'ツンデツンデ', types: ['rock', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/805.png' },
        { id: 806, name: 'ズガドーン', types: ['fire', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/806.png' },
        { id: 807, name: 'ゼラオラ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/807.png' },
        { id: 807, name: 'メガゼラオラ', types: ['electric'], image: 'images/mega_zeraora.png' },
        // Generation unknown
        { id: 808, name: 'メルタン', types: ['steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/808.png' },
        { id: 809, name: 'メルメタル', types: ['steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/809.png' },
        // Generation 8
        { id: 810, name: 'サルノリ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/810.png' },
        { id: 811, name: 'バチンキー', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/811.png' },
        { id: 812, name: 'ゴリランダー', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/812.png' },
        { id: 813, name: 'ヒバニー', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/813.png' },
        { id: 814, name: 'ラビフット', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/814.png' },
        { id: 815, name: 'エースバーン', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/815.png' },
        { id: 816, name: 'メッソン', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/816.png' },
        { id: 817, name: 'ジメレオン', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/817.png' },
        { id: 818, name: 'インテレオン', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/818.png' },
        { id: 819, name: 'ホシガリス', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/819.png' },
        { id: 820, name: 'ヨクバリス', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/820.png' },
        { id: 821, name: 'ココガラ', types: ['flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/821.png' },
        { id: 822, name: 'アオガラス', types: ['flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/822.png' },
        { id: 823, name: 'アーマーガア', types: ['flying', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/823.png' },
        { id: 824, name: 'サッチムシ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/824.png' },
        { id: 825, name: 'レドームシ', types: ['bug', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/825.png' },
        { id: 826, name: 'イオルブ', types: ['bug', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/826.png' },
        { id: 827, name: 'クスネ', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/827.png' },
        { id: 828, name: 'フォクスライ', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/828.png' },
        { id: 829, name: 'ヒメンカ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/829.png' },
        { id: 830, name: 'ワタシラガ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/830.png' },
        { id: 831, name: 'ウールー', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/831.png' },
        { id: 832, name: 'バイウールー', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/832.png' },
        { id: 833, name: 'カムカメ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/833.png' },
        { id: 834, name: 'カジリガメ', types: ['water', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/834.png' },
        { id: 835, name: 'ワンパチ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/835.png' },
        { id: 836, name: 'パルスワン', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/836.png' },
        { id: 837, name: 'タンドン', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/837.png' },
        { id: 838, name: 'トロッゴン', types: ['rock', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/838.png' },
        { id: 839, name: 'セキタンザン', types: ['rock', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/839.png' },
        { id: 840, name: 'カジッチュ', types: ['grass', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/840.png' },
        { id: 841, name: 'アップリュー', types: ['grass', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/841.png' },
        { id: 842, name: 'タルップル', types: ['grass', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/842.png' },
        { id: 843, name: 'スナヘビ', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/843.png' },
        { id: 844, name: 'サダイジャ', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/844.png' },
        { id: 845, name: 'ウッウ', types: ['flying', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/845.png' },
        { id: 846, name: 'サシカマス', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/846.png' },
        { id: 847, name: 'カマスジョー', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/847.png' },
        { id: 848, name: 'エレズン', types: ['electric', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/848.png' },
        { id: 849, name: 'ストリンダー', types: ['electric', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/849.png' },
        { id: 850, name: 'ヤクデ', types: ['fire', 'bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/850.png' },
        { id: 851, name: 'マルヤクデ', types: ['fire', 'bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/851.png' },
        { id: 852, name: 'タタッコ', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/852.png' },
        { id: 853, name: 'オトスパス', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/853.png' },
        { id: 854, name: 'ヤバチャ', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/854.png' },
        { id: 855, name: 'ポットデス', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/855.png' },
        { id: 856, name: 'ミブリム', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/856.png' },
        { id: 857, name: 'テブリム', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/857.png' },
        { id: 858, name: 'ブリムオン', types: ['psychic', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/858.png' },
        { id: 859, name: 'ベロバー', types: ['dark', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/859.png' },
        { id: 860, name: 'ギモー', types: ['dark', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/860.png' },
        { id: 861, name: 'オーロンゲ', types: ['dark', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/861.png' },
        { id: 862, name: 'タチフサグマ', types: ['dark', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/862.png' },
        { id: 863, name: 'ニャイキング', types: ['steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/863.png' },
        { id: 864, name: 'サニゴーン', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/864.png' },
        { id: 865, name: 'ネギガナイト', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/865.png' },
        { id: 866, name: 'バリコオル', types: ['ice', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/866.png' },
        { id: 867, name: 'デスバーン', types: ['ground', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/867.png' },
        { id: 868, name: 'マホミル', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/868.png' },
        { id: 869, name: 'マホイップ', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/869.png' },
        { id: 870, name: 'タイレーツ', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/870.png' },
        { id: 870, name: 'メガタイレーツ', types: ['fighting'], image: 'images/mega_falinks.png' },
        { id: 871, name: 'バチンウニ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/871.png' },
        { id: 872, name: 'ユキハミ', types: ['ice', 'bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/872.png' },
        { id: 873, name: 'モスノウ', types: ['ice', 'bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/873.png' },
        { id: 874, name: 'イシヘンジン', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/874.png' },
        { id: 875, name: 'コオリッポ', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/875.png' },
        { id: 876, name: 'イエッサン', types: ['psychic', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/876.png' },
        { id: 877, name: 'モルペコ', types: ['electric', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/877.png' },
        { id: 878, name: 'ゾウドウ', types: ['steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/878.png' },
        { id: 879, name: 'ダイオウドウ', types: ['steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/879.png' },
        { id: 880, name: 'パッチラゴン', types: ['electric', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/880.png' },
        { id: 881, name: 'パッチルドン', types: ['electric', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/881.png' },
        { id: 882, name: 'ウオノラゴン', types: ['water', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/882.png' },
        { id: 883, name: 'ウオチルドン', types: ['water', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/883.png' },
        { id: 884, name: 'ジュラルドン', types: ['steel', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/884.png' },
        { id: 885, name: 'ドラメシヤ', types: ['dragon', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/885.png' },
        { id: 886, name: 'ドロンチ', types: ['dragon', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/886.png' },
        { id: 887, name: 'ドラパルト', types: ['dragon', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/887.png' },
        { id: 888, name: 'ザシアン(れきせんのゆうしゃ)', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/888.png' },
        { id: 888, name: 'ザシアン(けんのおう)', types: ['fairy', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10188.png' },
        { id: 889, name: 'ザマゼンタ(れきせんのゆうしゃ)', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/889.png' },
        { id: 889, name: 'ザマゼンタ(たてのおう)', types: ['fighting', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10189.png' },
        { id: 890, name: 'ムゲンダイナ', types: ['poison', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/890.png' },
        { id: 891, name: 'ダクマ', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/891.png' },
        { id: 892, name: 'ウーラオス(いちげきのかた)', types: ['fighting', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/892.png' },
        { id: 892, name: 'ウーラオス(れんげきのかた)', types: ['fighting', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10191.png' },
        { id: 893, name: 'ザルード', types: ['dark', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/893.png' },
        { id: 894, name: 'レジエレキ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/894.png' },
        { id: 895, name: 'レジドラゴ', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/895.png' },
        { id: 896, name: 'ブリザポス', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/896.png' },
        { id: 897, name: 'レイスポス', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/897.png' },
        { id: 898, name: 'バドレックス', types: ['psychic', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/898.png' },
        { id: 898, name: 'バドレックス(はくばじょうのすがた)', types: ['psychic', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10193.png' },
        { id: 898, name: 'バドレックス(こくばじょうのすがた)', types: ['psychic', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10194.png' },
        // Generation hisui
        { id: 899, name: 'アヤシシ', types: ['normal', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/899.png' },
        { id: 900, name: 'バサギリ', types: ['bug', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/900.png' },
        { id: 901, name: 'ガチグマ', types: ['ground', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/901.png' },
        { id: 902, name: 'イダイトウ', types: ['water', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/902.png' },
        { id: 903, name: 'オオニューラ', types: ['fighting', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/903.png' },
        { id: 904, name: 'ハリーマン', types: ['dark', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/904.png' },
        { id: 905, name: 'ラブトロス', types: ['fairy', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/905.png' },
        // Generation 9
        { id: 906, name: 'ニャオハ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/906.png' },
        { id: 907, name: 'ニャローテ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/907.png' },
        { id: 908, name: 'マスカーニャ', types: ['grass', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/908.png' },
        { id: 909, name: 'ホゲータ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/909.png' },
        { id: 910, name: 'アチゲータ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/910.png' },
        { id: 911, name: 'ラウドボーン', types: ['fire', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/911.png' },
        { id: 912, name: 'クワッス', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/912.png' },
        { id: 913, name: 'ウェルカモ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/913.png' },
        { id: 914, name: 'ウェーニバル', types: ['water', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/914.png' },
        { id: 915, name: 'グルトン', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/915.png' },
        { id: 916, name: 'パフュートン', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/916.png' },
        { id: 917, name: 'タマンチュラ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/917.png' },
        { id: 918, name: 'ワナイダー', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/918.png' },
        { id: 919, name: 'マメバッタ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/919.png' },
        { id: 920, name: 'エクスレッグ', types: ['bug', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/920.png' },
        { id: 921, name: 'パモ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/921.png' },
        { id: 922, name: 'パモット', types: ['electric', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/922.png' },
        { id: 923, name: 'パーモット', types: ['electric', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/923.png' },
        { id: 924, name: 'ワッカネズミ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/924.png' },
        { id: 925, name: 'イッカネズミ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/925.png' },
        { id: 926, name: 'パピモッチ', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/926.png' },
        { id: 927, name: 'バウッツェル', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/927.png' },
        { id: 928, name: 'ミニーブ', types: ['grass', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/928.png' },
        { id: 929, name: 'オリーニョ', types: ['grass', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/929.png' },
        { id: 930, name: 'オリーヴァ', types: ['grass', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/930.png' },
        { id: 931, name: 'イキリンコ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/931.png' },
        { id: 932, name: 'コジオ', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/932.png' },
        { id: 933, name: 'ジオヅム', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/933.png' },
        { id: 934, name: 'キョジオーン', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/934.png' },
        { id: 935, name: 'カルボウ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/935.png' },
        { id: 936, name: 'グレンアルマ', types: ['fire', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/936.png' },
        { id: 937, name: 'ソウブレイズ', types: ['fire', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/937.png' },
        { id: 938, name: 'ズピカ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/938.png' },
        { id: 939, name: 'ハラバリー', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/939.png' },
        { id: 940, name: 'カイデン', types: ['electric', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/940.png' },
        { id: 941, name: 'タイカイデン', types: ['electric', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/941.png' },
        { id: 942, name: 'オラチフ', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/942.png' },
        { id: 943, name: 'マフィティフ', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/943.png' },
        { id: 944, name: 'シルシュルー', types: ['poison', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/944.png' },
        { id: 945, name: 'タギングル', types: ['poison', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/945.png' },
        { id: 946, name: 'アノクサ', types: ['grass', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/946.png' },
        { id: 947, name: 'アノホラグサ', types: ['grass', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/947.png' },
        { id: 948, name: 'ノノクラゲ', types: ['ground', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/948.png' },
        { id: 949, name: 'リククラゲ', types: ['ground', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/949.png' },
        { id: 950, name: 'ガケガニ', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/950.png' },
        { id: 951, name: 'カプサイジ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/951.png' },
        { id: 952, name: 'スコヴィラン', types: ['grass', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/952.png' },
        { id: 952, name: 'メガスコヴィラン', types: ['grass', 'fire'], image: 'images/mega_scovillain.png' },
        { id: 953, name: 'シガロコ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/953.png' },
        { id: 954, name: 'ベラカス', types: ['bug', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/954.png' },
        { id: 955, name: 'ヒラヒナ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/955.png' },
        { id: 956, name: 'クエスパトラ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/956.png' },
        { id: 957, name: 'カヌチャン', types: ['fairy', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/957.png' },
        { id: 958, name: 'ナカヌチャン', types: ['fairy', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/958.png' },
        { id: 959, name: 'デカヌチャン', types: ['fairy', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/959.png' },
        { id: 960, name: 'ウミディグダ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/960.png' },
        { id: 961, name: 'ウミトリオ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/961.png' },
        { id: 962, name: 'オトシドリ', types: ['flying', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/962.png' },
        { id: 963, name: 'ナミイルカ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/963.png' },
        { id: 964, name: 'イルカマン', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/964.png' },
        { id: 965, name: 'ブロロン', types: ['steel', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/965.png' },
        { id: 966, name: 'ブロロローム', types: ['steel', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/966.png' },
        { id: 967, name: 'モトトカゲ', types: ['dragon', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/967.png' },
        { id: 968, name: 'ミミズズ', types: ['steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/968.png' },
        { id: 969, name: 'キラーメ', types: ['rock', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/969.png' },
        { id: 970, name: 'キラフロル', types: ['rock', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/970.png' },
        { id: 970, name: 'メガキラフロル', types: ['rock', 'poison'], image: 'images/mega_glimmora.png' },
        { id: 971, name: 'ボチ', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/971.png' },
        { id: 972, name: 'ハカドッグ', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/972.png' },
        { id: 973, name: 'カラミンゴ', types: ['flying', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/973.png' },
        { id: 974, name: 'アルクジラ', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/974.png' },
        { id: 975, name: 'ハルクジラ', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/975.png' },
        { id: 976, name: 'ミガルーサ', types: ['water', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/976.png' },
        { id: 977, name: 'ヘイラッシャ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/977.png' },
        { id: 978, name: 'シャリタツ', types: ['dragon', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/978.png' },
        { id: 978, name: 'メガシャリタツ(そったすがた)', types: ['dragon', 'water'], image: 'images/mega_tatsugiri_curly.png' },
        { id: 978, name: 'メガシャリタツ(たれたすがた)', types: ['dragon', 'water'], image: 'images/mega_tatsugiri_droopy.png' },
        { id: 978, name: 'メガシャリタツ(のびたすがた)', types: ['dragon', 'water'], image: 'images/mega_tatsugiri_stretchy.png' },
        { id: 979, name: 'コノヨザル', types: ['fighting', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/979.png' },
        { id: 980, name: 'ドオー', types: ['poison', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/980.png' },
        { id: 981, name: 'リキキリン', types: ['normal', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/981.png' },
        { id: 982, name: 'ノココッチ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/982.png' },
        { id: 983, name: 'ドドゲザン', types: ['dark', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/983.png' },
        { id: 984, name: 'イダイナキバ', types: ['ground', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/984.png' },
        { id: 985, name: 'サケブシッポ', types: ['fairy', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/985.png' },
        { id: 986, name: 'アラブルタケ', types: ['grass', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/986.png' },
        { id: 987, name: 'ハバタクカミ', types: ['ghost', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/987.png' },
        { id: 988, name: 'チヲハウハネ', types: ['bug', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/988.png' },
        { id: 989, name: 'スナノケガワ', types: ['electric', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/989.png' },
        { id: 990, name: 'テツノワダチ', types: ['ground', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/990.png' },
        { id: 991, name: 'テツノツツミ', types: ['ice', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/991.png' },
        { id: 992, name: 'テツノカイナ', types: ['fighting', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/992.png' },
        { id: 993, name: 'テツノコウベ', types: ['dark', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/993.png' },
        { id: 994, name: 'テツノドクガ', types: ['fire', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/994.png' },
        { id: 995, name: 'テツノイバラ', types: ['rock', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/995.png' },
        { id: 996, name: 'セビエ', types: ['dragon', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/996.png' },
        { id: 997, name: 'セゴール', types: ['dragon', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/997.png' },
        { id: 998, name: 'セグレイブ', types: ['dragon', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/998.png' },
        { id: 998, name: 'メガセグレイブ', types: ['dragon', 'ice'], image: 'images/mega_baxcalibur.png' },
        { id: 999, name: 'コレクレー', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/999.png' },
        { id: 1000, name: 'サーフゴー', types: ['steel', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1000.png' },
        { id: 1001, name: 'チオンジェン', types: ['dark', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1001.png' },
        { id: 1002, name: 'パオジアン', types: ['dark', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1002.png' },
        { id: 1003, name: 'ディンルー', types: ['dark', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1003.png' },
        { id: 1004, name: 'イーユイ', types: ['dark', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1004.png' },
        { id: 1005, name: 'トドロクツキ', types: ['dragon', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1005.png' },
        { id: 1006, name: 'テツノブジン', types: ['fairy', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1006.png' },
        { id: 1007, name: 'コライドン', types: ['fighting', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1007.png' },
        { id: 1008, name: 'ミライドン', types: ['electric', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1008.png' },
        { id: 1009, name: 'ウネルミナモ', types: ['water', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1009.png' },
        { id: 1010, name: 'テツノイサハ', types: ['grass', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1010.png' },
        { id: 1011, name: 'カミッチュ', types: ['grass', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1011.png' },
        { id: 1012, name: 'チャデス', types: ['grass', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1012.png' },
        { id: 1013, name: 'ヤバソチャ', types: ['grass', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1013.png' },
        { id: 1014, name: 'イイネイヌ', types: ['poison', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1014.png' },
        { id: 1015, name: 'マシマシラ', types: ['poison', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1015.png' },
        { id: 1016, name: 'キチキギス', types: ['poison', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1016.png' },
        { id: 1017, name: 'オーガポン(みどりのめん)', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1017.png' },
        { id: 1017, name: 'オーガポン(いどのめん)', types: ['grass', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10273.png' },
        { id: 1017, name: 'オーガポン(かまどのめん)', types: ['grass', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10274.png' },
        { id: 1017, name: 'オーガポン(いしずえのめん)', types: ['grass', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10275.png' },
        { id: 1018, name: 'ブリジュラス', types: ['steel', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1018.png' },
        { id: 1019, name: 'カミツオロチ', types: ['grass', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1019.png' },
        { id: 1020, name: 'ウガツホムラ', types: ['fire', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1020.png' },
        { id: 1021, name: 'タケルライコ', types: ['electric', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1021.png' },
        { id: 1022, name: 'テツノイワオ', types: ['rock', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1022.png' },
        { id: 1023, name: 'テツノカシラ', types: ['steel', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1023.png' },
        { id: 1024, name: 'テラパゴス', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1024.png' },
        { id: 1025, name: 'モモワロウ', types: ['poison', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1025.png' },
    ];

    const typeChart = {
        // key: attacker, value: { defender: multiplier }
        // 2 = WIN, 0.5 = LOSE, 0 = LOSE (No effect)
        'fire': { 'grass': 2, 'ice': 2, 'bug': 2, 'steel': 2, 'water': 0.5, 'rock': 0.5, 'dragon': 0.5, 'fire': 0.5 },
        'water': { 'fire': 2, 'ground': 2, 'rock': 2, 'water': 0.5, 'grass': 0.5, 'dragon': 0.5 },
        'grass': { 'water': 2, 'ground': 2, 'rock': 2, 'fire': 0.5, 'grass': 0.5, 'poison': 0.5, 'flying': 0.5, 'bug': 0.5, 'dragon': 0.5, 'steel': 0.5 },
        'electric': { 'water': 2, 'flying': 2, 'electric': 0.5, 'grass': 0.5, 'dragon': 0.5, 'ground': 0 },
        'ice': { 'grass': 2, 'ground': 2, 'flying': 2, 'dragon': 2, 'fire': 0.5, 'water': 0.5, 'ice': 0.5, 'steel': 0.5 },
        'fighting': { 'normal': 2, 'ice': 2, 'rock': 2, 'dark': 2, 'steel': 2, 'poison': 0.5, 'flying': 0.5, 'psychic': 0.5, 'bug': 0.5, 'fairy': 0.5, 'ghost': 0 },
        'poison': { 'grass': 2, 'fairy': 2, 'poison': 0.5, 'ground': 0.5, 'rock': 0.5, 'ghost': 0.5, 'steel': 0 },
        'ground': { 'fire': 2, 'electric': 2, 'poison': 2, 'rock': 2, 'steel': 2, 'grass': 0.5, 'bug': 0.5, 'flying': 0 },
        'flying': { 'grass': 2, 'fighting': 2, 'bug': 2, 'electric': 0.5, 'rock': 0.5, 'steel': 0.5 },
        'psychic': { 'fighting': 2, 'poison': 2, 'psychic': 0.5, 'steel': 0.5, 'dark': 0 },
        'bug': { 'grass': 2, 'psychic': 2, 'dark': 2, 'fire': 0.5, 'fighting': 0.5, 'poison': 0.5, 'flying': 0.5, 'ghost': 0.5, 'steel': 0.5, 'fairy': 0.5 },
        'rock': { 'fire': 2, 'ice': 2, 'flying': 2, 'bug': 2, 'fighting': 0.5, 'ground': 0.5, 'steel': 0.5 },
        'ghost': { 'psychic': 2, 'ghost': 2, 'dark': 0.5, 'normal': 0 },
        'dragon': { 'dragon': 2, 'steel': 0.5, 'fairy': 0 },
        'steel': { 'ice': 2, 'rock': 2, 'fairy': 2, 'fire': 0.5, 'water': 0.5, 'electric': 0.5, 'steel': 0.5 },
        'dark': { 'psychic': 2, 'ghost': 2, 'fighting': 0.5, 'dark': 0.5, 'fairy': 0.5 },
        'fairy': { 'fighting': 2, 'dragon': 2, 'dark': 2, 'fire': 0.5, 'poison': 0.5, 'steel': 0.5 },
        'normal': { 'rock': 0.5, 'steel': 0.5, 'ghost': 0 }
    };

    // -- DOM Elements --
    const selectionScreen = document.getElementById('selection-screen');
    const battleScreen = document.getElementById('battle-screen');
    const pokemonGrid = document.getElementById('pokemon-grid');
    const playerFighterEl = document.getElementById('player-fighter');
    const cpuFighterEl = document.getElementById('cpu-fighter');
    const resultDisplay = document.getElementById('result-display');
    const resultMessage = document.getElementById('result-message');
    const restartBtn = document.getElementById('restart-btn');
    const returnToStartBtn = document.getElementById('return-to-start-btn');
    const instructionText = document.getElementById('instruction-text');
    const player1NameInput = document.getElementById('player1-name');
    const player2NameInput = document.getElementById('player2-name');
    const player1NameGroup = document.getElementById('player1-name-group');
    const player2NameGroup = document.getElementById('player2-name-group');
    const player1Label = document.getElementById('player1-label');
    const player2Label = document.getElementById('player2-label');
    const pokemonSearchInput = document.getElementById('pokemon-search');
    const searchSuggestions = document.getElementById('search-suggestions');
    const modeSelect = document.getElementById('mode-select');

    // -- Game State --
    let player1Pokemon = null;
    let player1Name = '';
    let player2Name = '';
    let selectedPokemon = null;
    let loadedCount = 0;
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then((registration) => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);

                    // Check for updates on load
                    registration.update();

                    // If a waiting worker exists, it means there is an update ready
                    if (registration.waiting) {
                        // We rely on skipWaiting() in sw.js to activate it, 
                        // or we could postMessage here if needed.
                        // But since we added self.skipWaiting() in sw.js install event,
                        // it should activate automatically.
                    }
                })
                .catch((err) => {
                    console.log('ServiceWorker registration failed: ', err);
                });

            // Reload page when new service worker takes control
            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (refreshing) return;
                refreshing = true;
                window.location.reload();
            });
        });
    }

    const POKEMON_COUNT = 1025;
    const BATCH_SIZE = 50;
    let observer = null;
    let currentPokemonList = pokemonData;
    let isOmakaseMode = false;
    let currentType1Filter = 'all';
    let currentType2Filter = 'all';
    let currentRegionFilter = 'all';
    let ruleTypes = [];
    let ruleRegions = [];
    let currentMode = 'full'; // 'full', 'omakase', 'type'
    let typeBattleMode = 'double'; // 'single' or 'double'
    let player1SelectedTypes = []; // For Type Mode
    let player2SelectedTypes = []; // For Type Mode
    let isDoubleTypeRequired = false; // Toggle state
    let damageCalculationMethod = 'multiply'; // 'multiply' or 'add'
    let actionTimeout = null;

    const GENERATION_RANGES = {
        'all': { min: 0, max: 100000 },
        'gen1': { min: 1, max: 151 },
        'gen2': { min: 152, max: 251 },
        'gen3': { min: 252, max: 386 },
        'gen4': { min: 387, max: 493 },
        'gen5': { min: 494, max: 649 },
        'gen6': { min: 650, max: 721 },
        'gen7': { min: 722, max: 807 },
        'unknown': { min: 808, max: 809 },
        'gen8': { min: 810, max: 905 },
        'gen9': { min: 906, max: 1025 },
        'hisui': { min: 899, max: 905 } // Special Handling usually, but adhering to IDs here
    };

    const REGION_LABELS = {
        'gen1': 'カントー (1-151)',
        'gen2': 'ジョウト (152-251)',
        'gen3': 'ホウエン (252-386)',
        'gen4': 'シンオウ (387-493)',
        'gen5': 'イッシュ (494-649)',
        'gen6': 'カロス (650-721)',
        'gen6_za': 'カロス地方(ZA)',
        'gen7': 'アローラ (722-807)',
        'unknown': '不明 (808-809)',
        'gen8': 'ガラル (810-905)',
        'gen9': 'パルデア (906-)',
        'hisui': 'ヒスイ'
    };

    const TYPE_LABELS = {
        'normal': 'ノーマル',
        'fire': 'ほのお',
        'water': 'みず',
        'electric': 'でんき',
        'grass': 'くさ',
        'ice': 'こおり',
        'fighting': 'かくとう',
        'poison': 'どく',
        'ground': 'じめん',
        'flying': 'ひこう',
        'psychic': 'エスパー',
        'bug': 'むし',
        'rock': 'いわ',
        'ghost': 'ゴースト',
        'dragon': 'ドラゴン',
        'dark': 'あく',
        'steel': 'はがね',
        'fairy': 'フェアリー'
    };

    // -- Init --
    initGame();

    function initGame() {
        player1Pokemon = null;
        player1Name = '';
        player2Name = '';
        currentPokemonList = pokemonData;
        renderPokemonGrid();

        // Header Reset
        // Header Reset (Removed as per user request to use header for Update trigger only)
        // document.querySelector('.game-header').addEventListener('click', ...);

        restartBtn.addEventListener('click', resetGame);
        if (returnToStartBtn) {
            returnToStartBtn.addEventListener('click', () => {
                location.reload();
            });
        }
        pokemonSearchInput.addEventListener('input', handleSearchInput);
        pokemonSearchInput.addEventListener('blur', () => {
            // Delay to allow click on suggestion
            setTimeout(() => hideSuggestions(), 200);
        });

        document.getElementById('region-filter').addEventListener('change', handleRegionChange);
        document.getElementById('type1-filter').addEventListener('change', handleType1Change);
        document.getElementById('type2-filter').addEventListener('change', handleType2Change);
        document.getElementById('mode-select').addEventListener('change', handleModeChange);

        // Multi-select rules (Checkboxes)
        const setupCheckboxListeners = (containerId, stateVar, syncKey) => {
            const container = document.getElementById(containerId);
            if (!container) return;
            const updateState = () => {
                const selected = Array.from(container.querySelectorAll('input:checked')).map(cb => cb.value);
                if (containerId === 'rule-region-checkboxes') ruleRegions = selected;
                else ruleTypes = selected;
                sendSettingsChange(syncKey, selected);
                syncSelectionFiltersWithRules();
            };
            container.querySelectorAll('input').forEach(cb => {
                cb.addEventListener('change', updateState);
            });

            // Bulk toggle buttons
            document.querySelectorAll(`.toggle-bulk-btn[data-target="${containerId}"]`).forEach(btn => {
                const updateButtonLabel = () => {
                    const checkboxes = container.querySelectorAll('input');
                    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
                    btn.textContent = (checkedCount === checkboxes.length) ? '全解除' : '全選択';
                };

                btn.addEventListener('click', () => {
                    const checkboxes = container.querySelectorAll('input');
                    const allSelected = Array.from(checkboxes).every(cb => cb.checked);
                    checkboxes.forEach(cb => {
                        cb.checked = !allSelected;
                    });
                    updateState();
                    updateButtonLabel();
                });

                // Update label on individual checkbox change
                container.querySelectorAll('input').forEach(cb => {
                    cb.addEventListener('change', updateButtonLabel);
                });

                // Initial label set
                updateButtonLabel();
            });

            // Initial state check
            updateState();
        };
        setupCheckboxListeners('rule-region-checkboxes', ruleRegions, 'ruleRegions');
        setupCheckboxListeners('rule-type-checkboxes', ruleTypes, 'ruleTypes');

        // Accordion Toggle Logic
        document.querySelectorAll('.accordion-trigger').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                // Don't toggle if a bulk button was clicked
                if (e.target.closest('.bulk-btn')) return;

                const group = trigger.closest('.rule-accordion-group');
                if (group) {
                    group.classList.toggle('open');
                }
            });
        });

        // Type button click handlers for Type Mode
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', handleTypeButtonClick);
        });
        document.getElementById('type-confirm-btn').addEventListener('click', confirmTypeSelection);

        // --- Type Mode Rules Management ---
        const updateToggleLabels = (toggleId) => {
            const toggle = document.getElementById(toggleId);
            if (!toggle) return;
            const isChecked = toggle.checked;

            if (toggleId === 'battle-rule-toggle') {
                const labelSingle = document.getElementById('label-rule-single');
                const labelDouble = document.getElementById('label-rule-double');
                if (labelSingle) labelSingle.classList.toggle('active', !isChecked);
                if (labelDouble) labelDouble.classList.toggle('active', isChecked);
            } else if (toggleId === 'constraint-toggle') {
                const labelFree = document.getElementById('label-constraint-free');
                const labelRequired = document.getElementById('label-constraint-required');
                if (labelFree) labelFree.classList.toggle('active', !isChecked);
                if (labelRequired) labelRequired.classList.toggle('active', isChecked);
            }
        };

        const setupLabelClick = (labelId, toggleId, targetValue) => {
            const label = document.getElementById(labelId);
            if (!label) return;
            label.addEventListener('click', () => {
                const toggle = document.getElementById(toggleId);
                if (toggle && !toggle.disabled && toggle.checked !== targetValue) {
                    toggle.checked = targetValue;
                    toggle.dispatchEvent(new Event('change'));
                }
            });
        };

        // Battle Rule labels
        setupLabelClick('label-rule-single', 'battle-rule-toggle', false);
        setupLabelClick('label-rule-double', 'battle-rule-toggle', true);
        // Constraint labels
        setupLabelClick('label-constraint-free', 'constraint-toggle', false);
        setupLabelClick('label-constraint-required', 'constraint-toggle', true);

        // Initial update
        updateToggleLabels('battle-rule-toggle');
        updateToggleLabels('constraint-toggle');

        // Expose to window for external calls if needed (like from applyBattleRuleChange)
        window.updateToggleLabels = updateToggleLabels;

        // Segmented Control Setup Helper
        const setupSegmentedControl = (containerId, callback, defaultValue) => {
            const container = document.getElementById(containerId);
            if (!container) return;

            const buttons = container.querySelectorAll('.segment-btn');
            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const value = btn.dataset.value;

                    // Update UI
                    buttons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    // Call handler
                    if (callback) callback(value);
                });
            });

            // Set initial state if needed
            // (Assuming HTML has 'active' class on default, or we force it here)
        };

        // Helper to update segmented control UI from external change (e.g. Peer)
        const updateSegmentedControlState = (containerId, value) => {
            const container = document.getElementById(containerId);
            if (!container) return;
            const buttons = container.querySelectorAll('.segment-btn');
            buttons.forEach(btn => {
                if (btn.dataset.value === value) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        };
        window.updateSegmentedControlState = updateSegmentedControlState;


        // Unified random button
        document.getElementById('random-type-btn').addEventListener('click', handleRandomTypeClick);

        // Battle Rule Buttons (1タイプ / 2タイプ)
        setupSegmentedControl('battle-rule-buttons', (value) => {
            applyBattleRuleChange(value === 'double');
            // Online sync
            sendSettingsChange('battleRule', value);
        }, 'double'); // Default 'double'

        setupSegmentedControl('constraint-buttons', (value) => {
            const isRequired = (value === 'true');
            applyConstraintChange(isRequired);
            // Online sync
            sendSettingsChange('constraint', isRequired);
        }, 'false'); // Default 'false'

        setupSegmentedControl('calc-method-buttons', (value) => {
            applyCalcMethodChange(value);
            // Online sync
            sendSettingsChange('calcMethod', value);
        }, 'multiply'); // Default 'multiply'

        const cancelSelectionBtn = document.getElementById('cancel-selection-btn');
        if (cancelSelectionBtn) {
            cancelSelectionBtn.addEventListener('click', () => {
                // Only clear tentative selection, not full game reset unless intended
                // For now, clear current selection.
                clearSelection();
                selectedPokemon = null;
                updateInstruction();
                // Important: If resetting "Random Card" selection, reset its content too 
                const randomCard = document.getElementById('random-card');
                if (randomCard && !randomCard.classList.contains('random-card')) {
                    resetRandomCard(randomCard);
                }
            });
        }

        // Back to Mode Selection from Rule Setting
        const backToModeFromRulesBtn = document.getElementById('back-to-mode-from-rules-btn');
        if (backToModeFromRulesBtn) {
            backToModeFromRulesBtn.addEventListener('click', () => {
                cancelConnection();
                showModeSelectionScreen();
            });
        }

        // Start Selection from Rule Setting
        const startSelectionBtn = document.getElementById('start-selection-btn');
        if (startSelectionBtn) {
            startSelectionBtn.addEventListener('click', () => {
                // Validation: At least one region must be selected (except in Type Mode)
                if (currentMode !== 'type') {
                    const checkedRegions = document.querySelectorAll('#rule-region-checkboxes input:checked');
                    if (checkedRegions.length === 0) {
                        alert('ちほうを 1つ以上 えらんでください！');
                        // Open region accordion if closed
                        const regionAccordion = document.getElementById('region-accordion-group');
                        if (regionAccordion && !regionAccordion.classList.contains('open')) {
                            const trigger = regionAccordion.querySelector('.accordion-trigger');
                            if (trigger) trigger.click();
                        }
                        return;
                    }
                }

                // Validation: At least one type must be selected
                const checkedTypes = document.querySelectorAll('#rule-type-checkboxes input:checked');
                if (checkedTypes.length === 0) {
                    alert('タイプを 1つ以上 えらんでください！');
                    // Open type accordion if closed
                    const typeAccordion = document.getElementById('type-accordion-group');
                    if (typeAccordion && !typeAccordion.classList.contains('open')) {
                        const trigger = typeAccordion.querySelector('.accordion-trigger');
                        if (trigger) trigger.click();
                    }
                    return;
                }

                // Validation: For "2 Types Required" rule, at least 2 types must be available
                if (currentMode === 'type' && typeBattleMode === 'double' && isDoubleTypeRequired) {
                    if (checkedTypes.length < 2) {
                        alert('「2つ必須」のルールでは、タイプを 2つ以上 有効にしてください！');
                        // Open type accordion if closed
                        const typeAccordion = document.getElementById('type-accordion-group');
                        if (typeAccordion && !typeAccordion.classList.contains('open')) {
                            const trigger = typeAccordion.querySelector('.accordion-trigger');
                            if (trigger) trigger.click();
                        }
                        return;
                    }
                }

                showSelectionScreen();
                if (isOnlineMode && conn) {
                    conn.send({ type: 'proceed_to_selection' });
                }
            });
        }

        const backToRulesBtn = document.getElementById('back-to-rules-btn');
        if (backToRulesBtn) {
            backToRulesBtn.addEventListener('click', () => {
                if (isOnlineMode) {
                    if (confirm('ルール設定に戻りますか？現在の選択はリセットされます。')) {
                        // Send message to peer (Host or Guest)
                        if (conn) {
                            conn.send({ type: 'back_to_rules' });
                        }

                        showRuleSettingScreen();
                        // Reset selections
                        clearSelection();
                        player1Pokemon = null;
                        myPokemonSelected = null;
                        opponentPokemonSelected = null;
                        updateInstruction();
                    }
                } else {
                    showRuleSettingScreen();
                }
            });
        }

        updateInstruction();
    }

    function handleModeChange(e) {
        const mode = e.target.value;
        const fromPeer = e.fromPeer || (e.detail && e.detail.fromPeer);

        // Online: Send settings to peer if change didn't come from peer
        if (!fromPeer) {
            sendSettingsChange('mode', mode);
        }

        const modeHint = document.getElementById('mode-hint');
        if (modeHint) {
            if (mode === 'full') {
                modeHint.textContent = 'すべてのポケモンからじゆうにえらんでバトル';
            } else if (mode === 'omakase') {
                modeHint.textContent = 'ランダムにえらばれた1体でバトル';
            } else if (mode === 'type') {
                modeHint.textContent = 'タイプをえらんでバトル';
            }
        }

        currentMode = mode;
        isOmakaseMode = (mode === 'omakase');
        const pokemonGrid = document.getElementById('pokemon-grid');
        const typeGrid = document.getElementById('type-selection-grid');
        const searchContainer = document.querySelector('.pokemon-search-container');
        const filterElements = searchContainer.querySelectorAll('select:not(#mode-select), input, .filter-controls');

        // Reset selections
        clearSelection();
        selectedPokemon = null;
        player1SelectedTypes = [];
        // --- Rule Setting Screen UI Updates ---
        const regionAccordion = document.getElementById('region-accordion-group');
        const typeModeAccordion = document.getElementById('type-mode-accordion-group');

        if (mode === 'type') {
            // Type Mode Rules: Hide region selection, show type rules accordion
            if (regionAccordion) regionAccordion.classList.add('hidden');
            if (typeModeAccordion) typeModeAccordion.classList.remove('hidden');

            // Type Mode Selection: Show type grid, hide pokemon grid and filters
            if (pokemonGrid) pokemonGrid.classList.add('hidden');
            if (typeGrid) typeGrid.classList.remove('hidden');
            filterElements.forEach(el => el.style.display = 'none');
            document.body.classList.remove('omakase-active');
            if (pokemonGrid) pokemonGrid.classList.remove('disabled');

            // Online Type Mode: Show only relevant name input
            if (isOnlineMode) {
                if (isHost) {
                    player1NameGroup.classList.remove('hidden');
                    player2NameGroup.classList.add('hidden');
                } else {
                    player1NameGroup.classList.add('hidden');
                    player2NameGroup.classList.remove('hidden');
                }
            }
        } else {
            // Full or Omakase Mode: Reset Rule Settings UI
            if (regionAccordion) regionAccordion.classList.remove('hidden');
            if (typeModeAccordion) typeModeAccordion.classList.add('hidden');

            // Selection screen updates
            if (pokemonGrid) pokemonGrid.classList.remove('hidden');
            if (typeGrid) typeGrid.classList.add('hidden');
            filterElements.forEach(el => el.style.display = '');

            if (isOmakaseMode) {
                document.body.classList.add('omakase-active');
                if (pokemonGrid) pokemonGrid.classList.add('disabled');
                if (pokemonSearchInput) {
                    pokemonSearchInput.disabled = true;
                    pokemonSearchInput.placeholder = 'おまかせモードはけんさくできません';
                }

                // Allow region/type filters in Omakase mode for everyone
                const regF = document.getElementById('region-filter');
                const t1F = document.getElementById('type1-filter');
                const t2F = document.getElementById('type2-filter');
                if (regF) regF.disabled = false;
                if (t1F) t1F.disabled = false;
                if (t2F) t2F.disabled = false;
            } else {
                document.body.classList.remove('omakase-active');
                if (pokemonGrid) pokemonGrid.classList.remove('disabled');
                if (pokemonSearchInput) {
                    pokemonSearchInput.disabled = false;
                    pokemonSearchInput.placeholder = 'ポケモンのなまえでけんさく';
                }

                // Enable region/type filters for everyone in Full mode
                const regF = document.getElementById('region-filter');
                const t1F = document.getElementById('type1-filter');
                const t2F = document.getElementById('type2-filter');
                if (regF) regF.disabled = false;
                if (t1F) t1F.disabled = false;
                if (t2F) t2F.disabled = false;
            }
        }
        updateInstruction();
    }
    function handleRegionChange(e) {
        currentRegionFilter = e.target.value;
        const fromPeer = e.fromPeer || (e.detail && e.detail.fromPeer);



        pokemonSearchInput.value = '';
        applyAllFilters();
    }

    function handleBattleRuleChange(e) {
        // Checked = Double (2 types), Unchecked = Single (1 type)
        const isDouble = e.target.checked;

        // Online: Send settings to guest
        sendSettingsChange('battleRule', isDouble ? 'double' : 'single');

        applyBattleRuleChange(isDouble);
    }

    function applyBattleRuleChange(isDouble) {
        typeBattleMode = isDouble ? 'double' : 'single';

        // Update button active states
        document.querySelectorAll('#battle-rule-buttons .segment-btn').forEach(btn => {
            if ((btn.dataset.value === 'double' && isDouble) || (btn.dataset.value === 'single' && !isDouble)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Show/Hide Constraint Selector with flex display
        const constraintSelector = document.getElementById('constraint-selector-wrapper');
        const desc = document.getElementById('battle-rule-desc');
        if (typeBattleMode === 'double') {
            if (constraintSelector) {
                constraintSelector.classList.remove('hidden');
                constraintSelector.style.display = 'flex';
            }
            if (desc) desc.textContent = '2つのタイプをえらんでたたかいます';
        } else {
            if (constraintSelector) {
                constraintSelector.classList.add('hidden');
                constraintSelector.style.display = 'none';
            }
            if (desc) desc.textContent = '1つのタイプをえらんでたたかいます';
        }

        // Auto-set constraint to "Required" (true) when switching to Double mode for better UX
        // This ensures validation is active by default.
        if (typeBattleMode === 'double') {
            applyConstraintChange(true);
            // Also update the toggle if it existed (but we use buttons now)
        }

        // Reset selections on rules change
        player1SelectedTypes = [];
        player2SelectedTypes = [];
        document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('selected'));
        updateInstruction();
    }

    function applyConstraintChange(isRequired) {
        isDoubleTypeRequired = isRequired;
        const desc = document.getElementById('constraint-desc');
        if (desc) {
            desc.textContent = isRequired ? '2タイプともルールに合わないとダメ' : '1タイプだけでもOK';
        }
        updateSegmentedControlState('constraint-buttons', isRequired.toString());
    }

    function applyCalcMethodChange(method) {
        damageCalculationMethod = method;
        const desc = document.getElementById('calc-method-desc');
        if (desc) {
            desc.textContent = (method === 'multiply') ? 'こうかを かけ算 します' : 'こうかを たし算 します';
        }
        updateSegmentedControlState('calc-method-buttons', method);
    }
    function handleTypeButtonClick(e) {
        const btn = e.target;
        const type = btn.dataset.type;

        // Determine which player is selecting
        let isPlayer1Turn;
        if (isOnlineMode) {
            isPlayer1Turn = isHost;
        } else {
            isPlayer1Turn = !player1Pokemon;
        }

        // Selection limit based on rule
        const limit = typeBattleMode === 'double' ? 2 : 1;

        // Current player's selection array
        let currentSelection = isPlayer1Turn ? player1SelectedTypes : player2SelectedTypes;

        if (btn.classList.contains('selected')) {
            // Deselect logic
            // Only allow deselect if it belongs to current player
            if (currentSelection.includes(type)) {
                btn.classList.remove('selected');
                currentSelection = currentSelection.filter(t => t !== type);
            }
        } else {
            // Select logic
            if (currentSelection.length < limit) {
                // Add to selection
                btn.classList.add('selected');
                currentSelection.push(type);
            } else if (limit === 1) {
                // Single mode: Swap selection
                const oldType = currentSelection[0];
                const oldBtn = document.querySelector(`.type-btn[data-type="${oldType}"]`);
                if (oldBtn) oldBtn.classList.remove('selected');
                btn.classList.add('selected');
                currentSelection = [type];
            }
        }

        // Update global selection array
        if (isPlayer1Turn) {
            player1SelectedTypes = currentSelection;
        } else {
            player2SelectedTypes = currentSelection;
        }

        updateInstruction();
    }

    function handleRandomTypeClick() {
        // In double mode, randomly choose 1 or 2. In single mode, always 1.
        let count = 1;
        if (typeBattleMode === 'double') {
            if (isDoubleTypeRequired) {
                count = 2; // Always 2 if required
            } else {
                count = (Math.random() < 0.5 ? 1 : 2);
            }
        }
        const types = [
            'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison',
            'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark',
            'steel', 'fairy'
        ];

        // Select random unique types
        const randomSelection = [];
        while (randomSelection.length < count) {
            const index = Math.floor(Math.random() * types.length);
            const type = types[index];
            if (!randomSelection.includes(type)) {
                randomSelection.push(type);
            }
        }

        // Update state and UI
        const isPlayer1Choice = isOnlineMode ? isHost : !player1Pokemon;

        if (isPlayer1Choice) {
            player1SelectedTypes = randomSelection;

            document.querySelectorAll('.type-btn').forEach(btn => {
                const type = btn.dataset.type;
                if (player1SelectedTypes.includes(type)) {
                    btn.classList.add('selected');
                } else {
                    btn.classList.remove('selected');
                }
            });
        } else {
            player2SelectedTypes = randomSelection;

            document.querySelectorAll('.type-btn').forEach(btn => {
                const type = btn.dataset.type;
                if (player2SelectedTypes.includes(type)) {
                    // Select new random P2 types
                    btn.classList.add('selected');
                } else {
                    // Deselect others
                    btn.classList.remove('selected');
                }
            });
        }

        updateInstruction();
    }

    function confirmTypeSelection() {
        // Check requirement
        let isPlayer1Turn;
        if (isOnlineMode) {
            isPlayer1Turn = isHost;
        } else {
            isPlayer1Turn = !player1Pokemon;
        }

        const currentSelection = isPlayer1Turn ? player1SelectedTypes : player2SelectedTypes;

        if (typeBattleMode === 'double' && isDoubleTypeRequired) {
            if (currentSelection.length < 2) {
                alert('2つのタイプをえらんでください！');
                return;
            }
        }
        if (currentMode !== 'type') return;

        const isPlayer1Choice = isOnlineMode ? isHost : !player1Pokemon;

        if (isPlayer1Choice && player1SelectedTypes.length > 0) {
            // Player 1 confirmed
            const pokemon = {
                name: getTypeDisplayName(player1SelectedTypes),
                types: player1SelectedTypes,
                image: null,
                isTypeOnly: true
            };

            if (isOnlineMode) {
                if (isHost) {
                    // Host finalized Trainer 1 selection
                    player1Pokemon = pokemon;
                    player1Name = player1NameInput.value.trim() || 'トレーナー 1';
                    myPokemonSelected = pokemon;
                    sendPokemonSelection(pokemon);
                    checkBothPlayersReady();
                    disableSelectionUI();
                    return;
                } else {
                    // Guest cannot select Trainer 1
                    return;
                }
            }

            // Confirm player 1 selection (Local mode)
            player1Pokemon = pokemon;
            player1Name = player1NameInput.value.trim() || 'トレーナー 1';

            // Show player 2 name input
            player1NameGroup.classList.add('hidden');
            player2NameGroup.classList.remove('hidden');

            // Reset type button states for player 2: Clear ALL selections so P2 doesn't see P1's choice
            document.querySelectorAll('.type-btn').forEach(btn => {
                btn.classList.remove('selected');
            });

            if (modeSelect.value !== 'full') {
                toggleFilters(true); // Disable filters/rules for Player 2 if NOT in full mode
            } else {
                const modeSelectEl = document.getElementById('mode-select');
                if (modeSelectEl) modeSelectEl.disabled = true; // Disable only mode select in full mode
            }

            // Change header color for Player 2
            document.querySelector('.game-header').classList.add('player2-turn');

            // Change confirm button color for Player 2
            const confirmBtn = document.getElementById('type-confirm-btn');
            if (confirmBtn) {
                confirmBtn.style.background = 'var(--secondary-color)';
            }

            updateInstruction();
        } else if (!isPlayer1Choice && player2SelectedTypes.length > 0) {
            // Player 2 confirmed
            const pokemon = {
                name: getTypeDisplayName(player2SelectedTypes),
                types: player2SelectedTypes,
                image: null,
                isTypeOnly: true
            };

            if (isOnlineMode) {
                if (!isHost) {
                    // Guest finalized Trainer 2 selection
                    player2Name = player2NameInput.value.trim() || 'トレーナー 2';
                    myPokemonSelected = pokemon;
                    sendPokemonSelection(pokemon);
                    checkBothPlayersReady();
                    disableSelectionUI();
                    return;
                } else {
                    // Host cannot select Trainer 2 sequentially in online mode
                    return;
                }
            }

            // Confirm player 2 selection and start battle (Local mode)
            player2Name = player2NameInput.value.trim() || 'トレーナー 2';
            startTypeBattle(player1Pokemon, pokemon);
        } else {
            alert('タイプをえらんでください！');
        }
    }

    function getTypeDisplayName(types) {
        const typeNames = {
            'normal': 'ノーマル', 'fire': 'ほのお', 'water': 'みず', 'electric': 'でんき',
            'grass': 'くさ', 'ice': 'こおり', 'fighting': 'かくとう', 'poison': 'どく',
            'ground': 'じめん', 'flying': 'ひこう', 'psychic': 'エスパー', 'bug': 'むし',
            'rock': 'いわ', 'ghost': 'ゴースト', 'dragon': 'ドラゴン', 'dark': 'あく',
            'steel': 'はがね', 'fairy': 'フェアリー'
        };
        return types.map(t => typeNames[t]).join(' / ');
    }

    function startTypeBattle(p1, p2) {
        window.scrollTo(0, 0);
        clearBattleResult();
        selectionScreen.classList.remove('active');
        selectionScreen.classList.add('hidden');
        battleScreen.classList.remove('hidden');
        battleScreen.classList.add('active');

        // Display type cards instead of Pokemon
        playerFighterEl.classList.remove('fighter-card');
        cpuFighterEl.classList.remove('fighter-card');
        displayTypeFighter(playerFighterEl, p1, player1Name);
        displayTypeFighter(cpuFighterEl, p2, player2Name);

        // Clear previous Pokemon names (from Full Mode)
        document.getElementById('player1-pokemon-name').textContent = '';
        document.getElementById('player2-pokemon-name').textContent = '';

        // Use standard resolveBattle logic for consistency
        // Use standard resolveBattle logic for consistency
        // Show View Result Button instead of auto-timeout
        const viewResultBtn = document.getElementById('view-result-btn');
        viewResultBtn.classList.remove('hidden');
        viewResultBtn.style.display = 'inline-block';
        viewResultBtn.onclick = () => {
            viewResultBtn.style.display = 'none';
            // Send show_result signal to opponent in online mode
            if (isOnlineMode && conn) {
                conn.send({ type: 'show_result' });
            }
            resolveBattle(p1, p2);
            viewResultBtn.onclick = null;
        };
    }

    function displayTypeFighter(element, fighter, name) {
        const typeBadges = fighter.types.map(type =>
            `<span class="type-badge ${type}">${getTypeDisplayName([type])}</span>`
        ).join('');

        element.innerHTML = `
            <div class="type-fighter-card">
                <div class="type-fighter-types">
                    ${typeBadges}
                </div>
            </div>
        `;
    }

    function handleType1Change(e) {
        currentType1Filter = e.target.value;
        const fromPeer = e.fromPeer || (e.detail && e.detail.fromPeer);



        pokemonSearchInput.value = '';
        applyAllFilters();
    }

    function handleType2Change(e) {
        currentType2Filter = e.target.value;
        const fromPeer = e.fromPeer || (e.detail && e.detail.fromPeer);



        pokemonSearchInput.value = '';
        applyAllFilters();
    }

    function applyAllFilters() {
        let filtered = pokemonData;

        // --- Step 1: Apply Room Rules (Mandatory) ---
        const applyRegionRule = (list, regions) => {
            if (regions.length === 0) return [];
            // If all are checked, it's effectively no filter, but let's filter properly
            return list.filter(p => {
                return regions.some(region => {
                    const range = GENERATION_RANGES[region];
                    if (!range) return false;

                    if (region === 'gen6') {
                        return ((p.id >= range.min && p.id <= range.max) || (p.name.includes('メガ') && p.name !== 'メガニウム' && p.name !== 'メガヤンマ')) && !p.image.includes('images/');
                    }
                    if (region === 'gen6_za') {
                        return p.image.includes('images/');
                    }
                    if (region === 'gen7') {
                        return (p.id >= range.min && p.id <= range.max) || p.name.includes('アローラ');
                    }
                    if (region === 'gen8') {
                        return (p.id >= range.min && p.id <= range.max) || p.name.includes('ガラル');
                    }
                    if (region === 'gen9') {
                        return (p.id >= range.min && p.id <= range.max) || p.name.includes('パルデア');
                    }
                    if (region === 'hisui') {
                        return (p.id >= 899 && p.id <= 905) || p.name.includes('ヒスイ');
                    }
                    return p.id >= range.min &&
                        p.id <= range.max &&
                        !p.name.includes('アローラ') &&
                        !p.name.includes('ガラル') &&
                        !p.name.includes('パルデア') &&
                        !p.name.includes('ヒスイ') &&
                        (!p.name.includes('メガ') || p.name === 'メガニウム' || p.name === 'メガヤンマ');
                });
            });
        };

        const applyRegionFilter = (list, region) => {
            const range = GENERATION_RANGES[region];
            if (region === 'all') return list;
            // (Re-use existing logic for selection screen filter)
            if (region === 'gen6') {
                return list.filter(p => ((p.id >= range.min && p.id <= range.max) || (p.name.includes('メガ') && p.name !== 'メガニウム' && p.name !== 'メガヤンマ')) && !p.image.includes('images/'));
            }
            if (region === 'gen6_za') {
                return list.filter(p => p.image.includes('images/'));
            }
            if (region === 'gen7') {
                return list.filter(p => (p.id >= range.min && p.id <= range.max) || p.name.includes('アローラ'));
            }
            if (region === 'gen8') {
                return list.filter(p => (p.id >= range.min && p.id <= range.max) || p.name.includes('ガラル'));
            }
            if (region === 'gen9') {
                return list.filter(p => (p.id >= range.min && p.id <= range.max) || p.name.includes('パルデア'));
            }
            if (region === 'hisui') {
                return list.filter(p => (p.id >= 899 && p.id <= 905) || p.name.includes('ヒスイ'));
            }
            return list.filter(p =>
                p.id >= range.min &&
                p.id <= range.max &&
                !p.name.includes('アローラ') &&
                !p.name.includes('ガラル') &&
                !p.name.includes('パルデア') &&
                !p.name.includes('ヒスイ') &&
                (!p.name.includes('メガ') || p.name === 'メガニウム' || p.name === 'メガヤンマ')
            );
        };

        const applyTypeRule = (list, types) => {
            if (types.length === 0) return [];
            return list.filter(p => {
                // Return true if any of the pokemon's types are in the allowed list
                return p.types.some(t => types.includes(t));
            });
        };

        const applyTypeFilter = (list, type, role) => {
            if (type === 'all') return list;
            if (type === 'none' && role === 'type2') {
                return list.filter(p => p.types.length === 1);
            }
            return list.filter(p => p.types.includes(type));
        };

        // Apply mandatory room rules
        filtered = applyRegionRule(filtered, ruleRegions);
        filtered = applyTypeRule(filtered, ruleTypes);

        // --- Step 2: Apply Personal Sorting (Selection screen filters) ---
        filtered = applyRegionFilter(filtered, currentRegionFilter);

        // Refined Type filtering logic: 
        // If both type filters are the same (and not 'all'), filter for monotype
        if (currentType1Filter !== 'all' && currentType1Filter === currentType2Filter) {
            filtered = filtered.filter(p => p.types.length === 1 && p.types[0] === currentType1Filter);
        } else {
            filtered = applyTypeFilter(filtered, currentType1Filter, 'type1');
            filtered = applyTypeFilter(filtered, currentType2Filter, 'type2');
        }

        currentPokemonList = filtered;
        renderPokemonGrid(currentPokemonList);
    }

    function handleSearchInput(e) {
        const query = e.target.value.trim().toLowerCase();
        if (query.length === 0) {
            hideSuggestions();
            return;
        }

        // DEBUG LOGS
        console.log('Search Query:', query);
        console.log('Active Rule Regions:', ruleRegions);
        console.log('Active Rule Types:', ruleTypes);

        const matches = pokemonData.filter(pokemon => {
            const matchesName = pokemon.name.toLowerCase().includes(query);

            // Check region rule
            // Check region rule
            const region = getRegionFromId(pokemon.id, pokemon.name);
            const matchesRegion = ruleRegions.includes(region);

            // Check type rule (at least one type must be allowed)
            const hasValidType = pokemon.types.some(t => ruleTypes.includes(t));

            return matchesName && matchesRegion && hasValidType;
        });

        if (matches.length > 0) {
            showSuggestions(matches);
        } else {
            hideSuggestions();
        }
    }

    function getRegionFromId(id, pokemonName) {
        // Handle Regional Forms by Name
        if (pokemonName) {
            if (pokemonName.includes('アローラのすがた')) return 'gen7';
            if (pokemonName.includes('ガラルのすがた')) return 'gen8';
            if (pokemonName.includes('ヒスイのすがた')) return 'hisui';
            if (pokemonName.includes('パルデアのすがた')) return 'gen9';
            if (pokemonName.includes('メガ')) return 'gen6';
        }

        // Handle high IDs (Megas/Forms not caught by name or without distinctive name)
        if (id > 10000) return 'unknown';

        for (const [key, range] of Object.entries(GENERATION_RANGES)) {
            if (key === 'all') continue;
            if (id >= range.min && id <= range.max) return key;
        }
        return 'unknown';
    }

    function showSuggestions(matches) {
        searchSuggestions.innerHTML = '';
        matches.forEach(pokemon => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            const typeBadges = pokemon.types.map(type =>
                `<span class="type-badge bg-${type}">${translateType(type)}</span>`
            ).join('');
            item.innerHTML = `
                <img src="${pokemon.image}" alt="${pokemon.name}">
                <span class="pokemon-name">${pokemon.name}</span>
                <div class="suggestion-types">${typeBadges}</div>
            `;
            item.addEventListener('click', () => {
                selectFromSearch(pokemon);
            });
            searchSuggestions.appendChild(item);
        });
        searchSuggestions.classList.remove('hidden');
    }

    function hideSuggestions() {
        searchSuggestions.classList.add('hidden');
    }

    function selectFromSearch(pokemon) {
        pokemonSearchInput.value = '';
        hideSuggestions();
        handlePokemonSelect(pokemon, null);
    }

    function updateInstruction() {
        if (modeSelectionScreen.classList.contains('active')) {
            instructionText.textContent = 'バトルモードをえらぼう！';
        } else if (onlineRoomScreen.classList.contains('active')) {
            instructionText.textContent = 'はなれたともだちとあそぼう！';
        } else if (document.getElementById('rule-setting-screen').classList.contains('active')) {
            instructionText.textContent = isOnlineMode ? 'あいてとルールをきめよう！' : 'ルールをきめよう！';
        } else if (selectionScreen.classList.contains('active')) {
            instructionText.textContent = 'ポケモンをえらぼう！';
        }
    }

    function getRandomPokemon() {
        // Use currentPokemonList to respect the selected region filter
        const listToSample = currentPokemonList && currentPokemonList.length > 0 ? currentPokemonList : pokemonData;
        const randomIndex = Math.floor(Math.random() * listToSample.length);
        return listToSample[randomIndex];
    }

    function handleRandomSelect() {
        const randomCard = document.getElementById('random-card');

        if (selectedPokemon && randomCard.classList.contains('selected')) {
            // Already selected the random one - confirm it
            handlePokemonSelect(selectedPokemon, randomCard);
        } else {
            // No selection or different selection - pick a new random pokemon
            const randomPokemon = getRandomPokemon();

            // Allow selection logic to run
            handlePokemonSelect(randomPokemon, randomCard);
        }
    }

    function updateCardToPokemon(cardElement, pokemon) {
        cardElement.classList.remove('random-card');
        cardElement.innerHTML = getPokemonCardInnerHtml(pokemon, false); // Disable lazy loading for active selection

        // Add close button listener
        const closeBtn = cardElement.querySelector('.card-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                clearSelection();
            });
        }
    }

    function resetRandomCard(cardElement) {
        cardElement.classList.add('random-card');
        cardElement.innerHTML = getRandomCardContent();
    }

    function getRandomCardContent() {
        return `
            <div class="monster-ball-icon">
                <div class="half-top"></div>
                <div class="half-bottom"></div>
                <div class="center-line"></div>
                <div class="center-circle"></div>
            </div>
            <h3>おまかせ</h3>
        `;
    }

    function getPokemonCardInnerHtml(pokemon, lazyLoad = true) { // lazyLoad arg kept for interface compatibility but ignored
        let displayId = pokemon.id;
        if (displayId >= 10000) {
            displayId -= 10000;
        }

        const typeBadges = pokemon.types.map(type =>
            `<span class="type-badge bg-${type}">${translateType(type)}</span>`
        ).join('');

        return `
            <div class="card-close-btn">×</div>
            <span class="pokemon-number">No.${String(displayId).padStart(3, '0')}</span>
            <img src="${pokemon.image}" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
            <div class="type-badges">${typeBadges}</div>
        `;
    }

    function renderPokemonGrid(list = null) {
        if (list) {
            currentPokemonList = list;
        } else if (!currentPokemonList) {
            currentPokemonList = pokemonData;
        }

        pokemonGrid.innerHTML = '';
        loadedCount = 0;

        // Add random card first
        const randomCard = document.createElement('div');
        randomCard.className = 'pokemon-card random-card';
        randomCard.id = 'random-card';
        randomCard.innerHTML = getRandomCardContent();
        randomCard.addEventListener('click', handleRandomSelect);
        pokemonGrid.appendChild(randomCard);

        setupObserver();
        loadNextBatch();
    }

    function setupObserver() {
        if (observer) {
            observer.disconnect();
        }

        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadNextBatch();
                }
            });
        }, { rootMargin: '200px' });
    }

    function loadNextBatch() {
        const nextBatch = currentPokemonList.slice(loadedCount, loadedCount + BATCH_SIZE);

        // Remove sentinel if it exists
        const sentinel = document.getElementById('grid-sentinel');
        if (sentinel) {
            observer.unobserve(sentinel);
            sentinel.remove();
        }

        nextBatch.forEach(pokemon => {
            const card = createPokemonCard(pokemon);
            pokemonGrid.appendChild(card);
        });

        loadedCount += nextBatch.length;

        // Add sentinel if there are more items
        if (loadedCount < currentPokemonList.length) {
            const newSentinel = document.createElement('div');
            newSentinel.id = 'grid-sentinel';
            newSentinel.style.gridColumn = '1 / -1';
            newSentinel.style.height = '20px';
            pokemonGrid.appendChild(newSentinel);
            observer.observe(newSentinel);
        }
    }

    function createPokemonCard(pokemon) {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.dataset.pokemonId = pokemon.id;
        card.innerHTML = getPokemonCardInnerHtml(pokemon, true); // Keep lazy loading for grid
        card.addEventListener('click', () => handlePokemonSelect(pokemon, card));

        // Add close button listener
        const closeBtn = card.querySelector('.card-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                clearSelection();
            });
        }

        return card;
    }

    function clearSelection() {
        const cards = pokemonGrid.querySelectorAll('.pokemon-card');
        cards.forEach(card => card.classList.remove('selected'));

        // Reset random card if it exists and was transformed
        const randomCard = document.getElementById('random-card');
        if (randomCard && !randomCard.classList.contains('random-card')) {
            resetRandomCard(randomCard);
        }

        // Reset state
        selectedPokemon = null;
        updateInstruction();
    }

    function handlePokemonSelect(pokemon, cardElement) {
        const randomCard = document.getElementById('random-card');

        if (player1Pokemon === null) {
            // Player 1's turn
            if (selectedPokemon === null || selectedPokemon.id !== pokemon.id) {
                // First click - select this pokemon
                clearSelection();
                selectedPokemon = pokemon;
                if (cardElement) {
                    cardElement.classList.add('selected');
                }

                // Show selection in random card
                if (randomCard) {
                    updateCardToPokemon(randomCard, pokemon);
                    randomCard.classList.add('selected');
                }

                instructionText.textContent = 'もういちどおしてけってい！';

                // Show cancel button
                const cancelBtn = document.getElementById('cancel-selection-btn');
                if (cancelBtn) {
                    cancelBtn.classList.remove('hidden');
                }


            } else {
                // Second click - confirm selection
                if (isOnlineMode && !isHost) {
                    player2Name = player2NameInput.value.trim() || 'トレーナー 2';
                } else {
                    player1Name = player1NameInput.value.trim() || 'トレーナー 1';
                }
                player1Pokemon = pokemon;
                selectedPokemon = null;
                clearSelection();

                // Online mode: send selection and wait for opponent
                if (isOnlineMode) {
                    myPokemonSelected = pokemon;
                    sendPokemonSelection(pokemon);
                    checkBothPlayersReady();
                    disableSelectionUI();
                    return;
                }

                // Local mode: Switch to Player 2's name input
                player1NameGroup.classList.add('hidden');
                player2NameGroup.classList.remove('hidden');

                // Change header color for Player 2
                document.querySelector('.game-header').classList.add('player2-turn');

                updateInstruction();
                if (modeSelect.value !== 'full') {
                    toggleFilters(true); // Disable filters for Player 2 selection if NOT in full mode
                } else {
                    document.getElementById('mode-select').disabled = true; // Disable only mode select in full mode

                    // Reset filters for Player 2
                    currentRegionFilter = 'all';
                    currentType1Filter = 'all';
                    currentType2Filter = 'all';

                    document.getElementById('region-filter').value = 'all';
                    document.getElementById('type1-filter').value = 'all';
                    document.getElementById('type2-filter').value = 'all';

                    applyAllFilters();
                }
            }
        } else {
            // Player 2's turn
            if (selectedPokemon === null || selectedPokemon.id !== pokemon.id) {
                // First click - select this pokemon
                clearSelection();
                selectedPokemon = pokemon;
                if (cardElement) {
                    cardElement.classList.add('selected');
                }

                // Show selection in random card
                if (randomCard) {
                    updateCardToPokemon(randomCard, pokemon);
                    randomCard.classList.add('selected');
                }

                instructionText.textContent = 'もういちどおしてけってい！';

                // Disable selection UI after confirming selection



                // Show cancel button
                const cancelBtn = document.getElementById('cancel-selection-btn');
                if (cancelBtn) {
                    cancelBtn.classList.remove('hidden');
                }


            } else {
                // Second click - confirm and start battle
                player2Name = player2NameInput.value.trim() || 'トレーナー 2';
                startGame(player1Pokemon, pokemon);
            }
        }
    }

    // Disable selection UI after confirming selection
    function disableSelectionUI() {
        // Disable pokemon grid completely
        document.getElementById('pokemon-grid').classList.add('fully-disabled');

        // Disable mode select (even for host)
        const modeSelect = document.getElementById('mode-select');
        if (modeSelect) modeSelect.disabled = true;

        // Disable filters
        const regionFilter = document.getElementById('region-filter');
        const type1Filter = document.getElementById('type1-filter');
        const type2Filter = document.getElementById('type2-filter');

        if (regionFilter) regionFilter.disabled = true;
        if (type1Filter) type1Filter.disabled = true;
        if (type2Filter) type2Filter.disabled = true;

        // Disable type mode toggles
        const battleRuleToggle = document.getElementById('battle-rule-toggle');
        const constraintToggle = document.getElementById('constraint-toggle');
        if (battleRuleToggle) battleRuleToggle.disabled = true;
        if (constraintToggle) constraintToggle.disabled = true;

        // Disable type selection grid
        const typeGrid = document.getElementById('type-selection-grid');
        if (typeGrid) typeGrid.classList.add('fully-disabled');

        // Disable random card specifically
        const randomCard = document.getElementById('random-card');
        if (randomCard) randomCard.style.pointerEvents = 'none';

        // Update instruction
        // instructionText.textContent = 'あいてのせんたくをまっています...'; // Moved to showWaitingIndicator
    }

    // Enable selection UI (for reset/rematch)
    function enableSelectionUI() {
        document.getElementById('pokemon-grid').classList.remove('fully-disabled');

        const randomCard = document.getElementById('random-card');
        if (randomCard) randomCard.style.pointerEvents = '';

        // Enable mode select if host or local
        if (!isOnlineMode || isHost) {
            const modeSelect = document.getElementById('mode-select');
            if (modeSelect) modeSelect.disabled = false;
        }

        // Enable region/type filters based on mode and role
        const regionFilter = document.getElementById('region-filter');
        const type1Filter = document.getElementById('type1-filter');
        const type2Filter = document.getElementById('type2-filter');

        const isFilterAllowed = (!isOnlineMode || isHost || currentMode === 'full' || currentMode === 'omakase');

        if (regionFilter) regionFilter.disabled = !isFilterAllowed;
        if (type1Filter) type1Filter.disabled = !isFilterAllowed;
        if (type2Filter) type2Filter.disabled = !isFilterAllowed;

        // Re-enable type mode toggles (only if host or local)
        if (!isOnlineMode || isHost) {
            const battleRuleToggle = document.getElementById('battle-rule-toggle');
            const constraintToggle = document.getElementById('constraint-toggle');
            if (battleRuleToggle) battleRuleToggle.disabled = false;
            if (constraintToggle) constraintToggle.disabled = false;
        }

        // Re-enable type selection grid
        const typeGrid = document.getElementById('type-selection-grid');
        if (typeGrid) typeGrid.classList.remove('fully-disabled');
    }

    function translateType(type) {
        const dict = {
            'fire': 'ほのお',
            'water': 'みず',
            'grass': 'くさ',
            'electric': 'でんき',
            'psychic': 'エスパー',
            'ice': 'こおり',
            'fighting': 'かくとう',
            'ground': 'じめん',
            'flying': 'ひこう',
            'rock': 'いわ',
            'poison': 'どく',
            'bug': 'むし',
            'ghost': 'ゴースト',
            'steel': 'はがね',
            'dragon': 'ドラゴン',
            'dark': 'あく',
            'fairy': 'フェアリー',
            'normal': 'ノーマル'
        };
        return dict[type] || type;
    }

    function startGame(player1, player2) {
        window.scrollTo(0, 0);
        clearBattleResult();
        // Update labels with player names
        player1Label.textContent = player1Name;
        player2Label.textContent = player2Name;

        // Reset header color for battle
        document.querySelector('.game-header').classList.remove('player2-turn');

        // Update instruction
        instructionText.textContent = 'バトルスタート！';

        // Set pokemon names
        document.getElementById('player1-pokemon-name').textContent = player1.name;
        document.getElementById('player2-pokemon-name').textContent = player2.name;

        // Transition to battle screen
        selectionScreen.classList.remove('active');
        selectionScreen.classList.add('hidden');
        battleScreen.classList.remove('hidden');
        battleScreen.classList.add('active');

        // Show both players
        updateFighterCard(playerFighterEl, player1);
        updateFighterCard(cpuFighterEl, player2);



        // Show View Result Button instead of auto-timeout
        const viewResultBtn = document.getElementById('view-result-btn');
        viewResultBtn.classList.remove('hidden');
        viewResultBtn.style.display = 'inline-block';
        viewResultBtn.onclick = () => {
            viewResultBtn.style.display = 'none';
            // Send show_result signal to opponent in online mode
            if (isOnlineMode && conn) {
                conn.send({ type: 'show_result' });
            }
            resolveBattle(player1, player2);
            viewResultBtn.onclick = null;
        };
    }

    function updateFighterCard(element, pokemon) {
        element.classList.add('fighter-card');
        element.innerHTML = `<img src="${pokemon.image}" alt="${pokemon.name}">`;
        element.style.borderColor = `var(--type-${pokemon.types[0]})`;
    }

    function resolveBattle(p1, p2) {
        // Ensure View Result button is hidden
        const viewResultBtn = document.getElementById('view-result-btn');
        if (viewResultBtn) viewResultBtn.style.display = 'none';

        const { result, p1Multiplier, p2Multiplier, p1Process, p2Process } = calculateEffectiveness(p1.types, p2.types);

        // Update instruction
        instructionText.textContent = 'そこまで！';

        let message = '';
        const gameHeader = document.querySelector('.game-header');

        if (result === 'win') {
            message = `${player1Name} のかち！`;
            resultMessage.style.color = '#F44336';

            // Player 1 Wins (Red)
            gameHeader.classList.remove('player2-turn');
            restartBtn.style.background = 'var(--primary-color)';
            if (returnToStartBtn) returnToStartBtn.style.background = 'var(--primary-color)';

        } else if (result === 'lose') {
            message = `${player2Name} のかち！`;
            resultMessage.style.color = '#2196F3';

            // Player 2 Wins (Blue)
            gameHeader.classList.add('player2-turn');
            restartBtn.style.background = 'var(--secondary-color)';
            if (returnToStartBtn) returnToStartBtn.style.background = 'var(--secondary-color)';

        } else {
            message = 'ひきわけ';
            resultMessage.style.color = '#9E9E9E';

            // Draw - Gray Header and Button
            gameHeader.classList.remove('player2-turn');
            gameHeader.classList.add('draw-result');
            restartBtn.style.background = '#9E9E9E';
            if (returnToStartBtn) returnToStartBtn.style.background = '#9E9E9E';
        }

        resultMessage.textContent = message;

        // Show types and multipliers under each pokemon
        const p1TypesStr = p1.types.map(t => translateType(t)).join('/');
        const p2TypesStr = p2.types.map(t => translateType(t)).join('/');

        document.getElementById('player1-types').textContent = currentMode === 'type' ? '' : p1TypesStr;
        document.getElementById('player1-multiplier').textContent = `×${p1Multiplier}`;
        const p1ProcessEl = document.getElementById('player1-process');
        p1ProcessEl.innerHTML = p1Process.map(step => `<div>${step}</div>`).join('');
        p1ProcessEl.classList.add('active');

        document.getElementById('player2-types').textContent = currentMode === 'type' ? '' : p2TypesStr;
        document.getElementById('player2-multiplier').textContent = `×${p2Multiplier}`;

        const p2ProcessEl = document.getElementById('player2-process');
        p2ProcessEl.innerHTML = p2Process.map(step => `<div>${step}</div>`).join('');
        p2ProcessEl.classList.add('active');

        resultDisplay.classList.remove('hidden');
    }

    function clearBattleResult() {
        resultMessage.textContent = '';
        document.getElementById('player1-multiplier').textContent = '';

        const p1ProcessEl = document.getElementById('player1-process');
        p1ProcessEl.innerHTML = '';
        p1ProcessEl.classList.remove('active');

        document.getElementById('player1-types').textContent = '';
        document.getElementById('player2-multiplier').textContent = '';

        const p2ProcessEl = document.getElementById('player2-process');
        p2ProcessEl.innerHTML = '';
        p2ProcessEl.classList.remove('active');

        document.getElementById('player2-types').textContent = '';
    }

    function calculateEffectiveness(attackerTypes, defenderTypes) {
        const isAddMode = (damageCalculationMethod === 'add');

        // Calculate total multiplier for attacker vs defender
        let attackerTotal = isAddMode ? 0 : 1;
        const attackerProcess = [];

        // Matchups count for loop
        let matchCount = 0;

        for (const atkType of attackerTypes) {
            const relationships = typeChart[atkType] || {};
            for (const defType of defenderTypes) {
                const mult = relationships[defType] !== undefined ? relationships[defType] : 1;

                if (isAddMode) {
                    attackerTotal += mult;
                } else {
                    attackerTotal *= mult;
                }
                matchCount++;
                attackerProcess.push(`${translateType(atkType)} → ${translateType(defType)} (×${mult})`);
            }
        }

        // For addition mode, if there are multiple matchups (e.g. dual types),
        // we might want to normalize or just sum?
        // User spec: 
        // x2 + x2 = x4 (Matches x2 * x2 = x4)
        // x2 + x0.5 = x2.5 (vs x1)
        // x0 + x2 = x2 (vs x0)
        // This implies simple sum of all individual effectiveness numbers.
        // Base should start at 0.
        // If single type vs single type: start 0, add mult. Correct.

        // Calculate total multiplier for defender vs attacker
        let defenderTotal = isAddMode ? 0 : 1;
        const defenderProcess = [];

        for (const defType of defenderTypes) {
            const relationships = typeChart[defType] || {};
            for (const atkType of attackerTypes) {
                const mult = relationships[atkType] !== undefined ? relationships[atkType] : 1;

                if (isAddMode) {
                    defenderTotal += mult;
                } else {
                    defenderTotal *= mult;
                }
                defenderProcess.push(`${translateType(defType)} → ${translateType(atkType)} (×${mult})`);
            }
        }

        // Compare multipliers
        let result;
        if (attackerTotal > defenderTotal) {
            result = 'win';
        } else if (attackerTotal < defenderTotal) {
            result = 'lose';
        } else {
            result = 'draw';
        }

        return {
            result,
            p1Multiplier: attackerTotal,
            p2Multiplier: defenderTotal,
            p1Process: attackerProcess,
            p2Process: defenderProcess
        };
    }

    function resetGame() {
        window.scrollTo(0, 0);
        if (actionTimeout) clearTimeout(actionTimeout);
        clearBattleResult();
        battleScreen.classList.remove('active');
        battleScreen.classList.add('hidden');

        // Online mode: keep connection, go back to selection screen for rematch
        if (isOnlineMode && conn) {
            // Send rematch signal to opponent
            conn.send({ type: 'rematch' });

            // Reset game state but keep connection
            myPokemonSelected = null;
            opponentPokemonSelected = null;
            waitingForOpponent = false;
            hideWaitingIndicator();

            player1Pokemon = null;
            // Do not reset player names on rematch
            // player1Name = '';
            // player2Name = '';
            selectedPokemon = null;

            // Hide result display
            resultDisplay.classList.add('hidden');

            // Clear fighter displays
            playerFighterEl.innerHTML = '';
            cpuFighterEl.innerHTML = '';
            playerFighterEl.style.borderColor = '#ddd';
            cpuFighterEl.style.borderColor = '#ddd';

            // Reset View Result Button
            const viewResultBtn = document.getElementById('view-result-btn');
            if (viewResultBtn) {
                viewResultBtn.style.display = 'none';
                viewResultBtn.onclick = null;
            }

            // Reset header color (only if host, guest stays blue)
            if (isHost) {
                document.querySelector('.game-header').classList.remove('player2-turn');
            }
            document.querySelector('.game-header').classList.remove('draw-result');
            restartBtn.style.background = '';
            if (returnToStartBtn) returnToStartBtn.style.background = '#757575'; // Reset to default grey

            // Show selection screen (keep connection)
            selectionScreen.classList.remove('hidden');
            selectionScreen.classList.add('active');

            if (isHost) {
                player1NameGroup.classList.remove('hidden');
                player2NameGroup.classList.add('hidden');
            } else {
                // Guest is Trainer 2
                player1NameGroup.classList.add('hidden');
                player1NameGroup.classList.add('hidden');
                player2NameGroup.classList.remove('hidden');
                document.querySelector('.game-header').classList.add('player2-turn');
            }

            // Re-enable selection UI
            enableSelectionUI();

            instructionText.textContent = 'つぎのポケモンをえらぼう！';
            return;
        }

        selectionScreen.classList.remove('hidden');
        selectionScreen.classList.add('active');

        resultDisplay.classList.add('hidden');
        playerFighterEl.innerHTML = '';
        cpuFighterEl.innerHTML = '';
        playerFighterEl.style.borderColor = '#ddd';
        cpuFighterEl.style.borderColor = '#ddd';
        // Restore fighter-card class for standard modes
        playerFighterEl.classList.add('fighter-card');
        cpuFighterEl.classList.add('fighter-card');

        // Reset name inputs
        player1NameGroup.classList.remove('hidden');
        player2NameGroup.classList.add('hidden');

        // Reset header color
        document.querySelector('.game-header').classList.remove('player2-turn');
        document.querySelector('.game-header').classList.remove('draw-result');
        restartBtn.style.background = ''; // Reset button color
        if (returnToStartBtn) returnToStartBtn.style.background = '#757575'; // Reset to default grey

        player1NameInput.value = '';
        player2NameInput.value = '';
        pokemonSearchInput.value = '';
        hideSuggestions();

        // Reset game state
        player1Pokemon = null;
        player1Name = '';
        player2Name = '';
        selectedPokemon = null;
        clearSelection();

        // Reset View Result Button
        // Reset View Result Button
        const viewResultBtn = document.getElementById('view-result-btn');
        if (viewResultBtn) {
            viewResultBtn.style.display = 'none';
            viewResultBtn.onclick = null;
        }

        // Reset Type Mode state
        player1SelectedTypes = [];
        player2SelectedTypes = [];
        document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('selected'));

        // Reset confirm button color
        const confirmBtn = document.getElementById('type-confirm-btn');
        if (confirmBtn) {
            confirmBtn.style.background = '';
        }

        // Restore correct UI based on current mode
        const pokemonGrid = document.getElementById('pokemon-grid');
        const typeGrid = document.getElementById('type-selection-grid');
        const searchContainer = document.querySelector('.pokemon-search-container');
        const filterElements = searchContainer.querySelectorAll('select:not(#mode-select), input');

        if (currentMode === 'type') {
            pokemonGrid.classList.add('hidden');
            typeGrid.classList.remove('hidden');
            filterElements.forEach(el => el.style.display = 'none');
        } else {
            pokemonGrid.classList.remove('hidden');
            typeGrid.classList.add('hidden');
            filterElements.forEach(el => el.style.display = '');
        }

        // Ensure filters are enabled on reset
        toggleFilters(false);
        updateInstruction();
    }

    function toggleFilters(disabled) {
        const ids = ['mode-select', 'region-filter', 'type1-filter', 'type2-filter'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.disabled = disabled;
        });
        document.querySelectorAll('.segment-btn').forEach(btn => btn.disabled = disabled);
    }

    updateInstruction();
});
