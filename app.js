document.addEventListener('DOMContentLoaded', () => {
    const commandSelector = document.getElementById('command-selector');
    const commandOptionsContainer = document.getElementById('command-options');
    const commandOutput = document.getElementById('command-output');
    const copyButton = document.getElementById('copy-button');
    const errorContainer = document.getElementById('error-container');

    const commands = {
        "ability": { "args": [{ "name": "target", "type": "target", "required": true }, { "name": "ability", "type": "text", "enum": ["mayfly", "mute", "worldbuilder"], "required": true }, { "name": "value", "type": "boolean", "required": false }] },
        "camerashake": { "args": [{ "name": "target", "type": "target", "required": true }, { "name": "intensity", "type": "number", "required": false }, { "name": "seconds", "type": "number", "required": false }, { "name": "shakeType", "type": "text", "enum": ["positional", "rotational"], "required": false }] },
        "clear": { "args": [{ "name": "target", "type": "target", "required": false }, { "name": "itemName", "type": "text", "required": false }, { "name": "data", "type": "number", "required": false }, { "name": "maxCount", "type": "number", "required": false }] },
        "clone": { "args": [{ "name": "begin", "type": "coords", "required": true }, { "name": "end", "type": "coords", "required": true }, { "name": "destination", "type": "coords", "required": true }, { "name": "maskMode", "type": "text", "enum": ["replace", "masked", "filtered"], "required": false }, { "name": "cloneMode", "type": "text", "enum": ["force", "move", "normal"], "required": false }] },
        "effect": { "args": [{ "name": "target", "type": "target", "required": true }, { "name": "effect", "type": "text", "required": true }, { "name": "seconds", "type": "number", "required": false }, { "name": "amplifier", "type": "number", "required": false }, { "name": "hideParticles", "type": "boolean", "required": false }] },
        "enchant": { "args": [{ "name": "target", "type": "target", "required": true }, { "name": "enchantmentName", "type": "text", "required": true }, { "name": "level", "type": "number", "required": false }] },
        "event": { "args": [{ "name": "target", "type": "target", "required": true }, { "name": "eventName", "type": "text", "required": true }] },
        "execute": {
            "type": "builder",
            "subcommands": {
                "as": { "args": [{ "name": "target", "type": "target", "required": true }] },
                "at": { "args": [{ "name": "target", "type": "target", "required": true }] },
                "positioned": { "args": [{ "name": "position", "type": "coords", "required": true }] },
                "rotated": { "args": [{ "name": "rotation", "type": "text", "placeholder": "y-rot x-rot", "required": true }] },
                "facing": { "args": [{ "name": "position", "type": "coords", "required": true }] },
                "align": { "args": [{ "name": "axes", "type": "text", "placeholder": "xyz", "required": true }] },
                "anchored": { "args": [{ "name": "anchor", "type": "text", "enum": ["eyes", "feet"], "required": true }] },
                "in": { "args": [{ "name": "dimension", "type": "text", "enum": ["overworld", "nether", "the_end"], "required": true }] },
                "if": {
                    "args": [
                        { "name": "conditionType", "type": "text", "enum": ["block", "blocks", "entity", "score"], "required": true }
                    ],
                    "dynamicArgs": {
                        "block": [{ "name": "position", "type": "coords", "required": true }, { "name": "block", "type": "text", "required": true }, { "name": "data", "type": "number", "required": false }],
                        "blocks": [{ "name": "begin", "type": "coords", "required": true }, { "name": "end", "type": "coords", "required": true }, { "name": "destination", "type": "coords", "required": true }, { "name": "mode", "type": "text", "enum": ["all", "masked"], "required": false }],
                        "entity": [{ "name": "target", "type": "target", "required": true }],
                        "score": [{ "name": "target", "type": "target", "required": true }, { "name": "objective", "type": "text", "required": true }, { "name": "operator", "type": "text", "enum": ["<", "<=", "=", ">=", ">"], "required": false }, { "name": "source", "type": "text", "required": false, "placeholder": "target or score" }]
                    }
                },
                "unless": {
                    "args": [
                        { "name": "conditionType", "type": "text", "enum": ["block", "blocks", "entity", "score"], "required": true }
                    ],
                    "dynamicArgs": {
                        "block": [{ "name": "position", "type": "coords", "required": true }, { "name": "block", "type": "text", "required": true }, { "name": "data", "type": "number", "required": false }],
                        "blocks": [{ "name": "begin", "type": "coords", "required": true }, { "name": "end", "type": "coords", "required": true }, { "name": "destination", "type": "coords", "required": true }, { "name": "mode", "type": "text", "enum": ["all", "masked"], "required": false }],
                        "entity": [{ "name": "target", "type": "target", "required": true }],
                        "score": [{ "name": "target", "type": "target", "required": true }, { "name": "objective", "type": "text", "required": true }, { "name": "operator", "type": "text", "enum": ["<", "<=", "=", ">=", ">"], "required": false }, { "name": "source", "type": "text", "required": false, "placeholder": "target or score" }]
                    }
                },
                "store": {
                    "args": [
                        { "name": "target", "type": "text", "enum": ["result", "success"], "required": true },
                        { "name": "type", "type": "text", "enum": ["block", "bossbar", "entity", "score"], "required": true }
                    ],
                    "dynamicArgs": {
                        "block": [{ "name": "position", "type": "coords", "required": true }, { "name": "path", "type": "text", "required": true }, { "name": "type", "type": "text", "enum": ["byte", "short", "int", "long", "float", "double"], "required": true }, { "name": "scale", "type": "number", "required": false }],
                        "bossbar": [{ "name": "id", "type": "text", "required": true }, { "name": "path", "type": "text", "enum": ["value", "max"], "required": true }],
                        "entity": [{ "name": "target", "type": "target", "required": true }, { "name": "path", "type": "text", "required": true }, { "name": "type", "type": "text", "enum": ["byte", "short", "int", "long", "float", "double"], "required": true }, { "name": "scale", "type": "number", "required": false }],
                        "score": [{ "name": "target", "type": "target", "required": true }, { "name": "objective", "type": "text", "required": true }]
                    }
                }
            }
        },
        "fill": { "args": [{ "name": "from", "type": "coords", "required": true }, { "name": "to", "type": "coords", "required": true }, { "name": "tileName", "type": "text", "required": true }, { "name": "tileData", "type": "number", "required": false }, { "name": "replace", "type": "text", "required": false, "placeholder": "replace tileName tileData" }] },
        "fog": { "args": [{ "name": "target", "type": "target", "required": true }, { "name": "mode", "type": "text", "enum": ["push", "pop", "remove"], "required": true }, { "name": "fogId", "type": "text", "required": true, "placeholder": "minecraft:fog_default" }] },
        "function": { "args": [{ "name": "functionPath", "type": "text", "required": true }] },
        "gamemode": { "args": [{ "name": "mode", "type": "text", "enum": ["survival", "creative", "adventure", "default", "spectator"], "required": true }, { "name": "target", "type": "target", "required": false }] },
        "give": { "args": [{ "name": "target", "type": "target", "required": true }, { "name": "itemName", "type": "text", "required": true }, { "name": "amount", "type": "number", "required": false }, { "name": "data", "type": "number", "required": false }, { "name": "components", "type": "json", "required": false, "placeholder": '{"minecraft:can_place_on":{"blocks":["stone"]}}' }] },
        "kill": { "args": [{ "name": "target", "type": "target", "required": false }] },
        "particle": { "args": [{ "name": "effect", "type": "text", "required": true }, { "name": "position", "type": "coords", "required": false }] },
        "playsound": { "args": [{ "name": "sound", "type": "text", "required": true }, { "name": "target", "type": "target", "required": false }, { "name": "position", "type": "coords", "required": false }, { "name": "volume", "type": "number", "required": false }, { "name": "pitch", "type": "number", "required": false }, { "name": "minimumVolume", "type": "number", "required": false }] },
        "say": { "args": [{ "name": "message", "type": "text", "required": true }] },
        "scoreboard": { "args": [{ "name": "command", "type": "text", "required": true, "placeholder": "objectives add..." }] },
        "setblock": { "args": [{ "name": "position", "type": "coords", "required": true }, { "name": "tileName", "type": "text", "required": true }, { "name": "tileData", "type": "number", "required": false }, { "name": "mode", "type": "text", "enum": ["replace", "destroy", "keep"], "required": false }] },
        "spawnpoint": { "args": [{ "name": "target", "type": "target", "required": false }, { "name": "position", "type": "coords", "required": false }] },
        "summon": { "args": [{ "name": "entityType", "type": "text", "required": true }, { "name": "spawnPos", "type": "coords", "required": false }, { "name": "spawnEvent", "type": "text", "required": false }, { "name": "nameTag", "type": "text", "required": false }] },
        "tag": { "args": [{ "name": "target", "type": "target", "required": true }, { "name": "action", "type": "text", "enum": ["add", "remove", "list"], "required": true }, { "name": "tagName", "type": "text", "required": true }] },
        "teleport": { "args": [{ "name": "target", "type": "target", "required": true }, { "name": "destination", "type": "coords", "required": true }] },
        "tell": { "args": [{ "name": "target", "type": "target", "required": true }, { "name": "message", "type": "text", "required": true }] },
        "testfor": { "args": [{ "name": "target", "type": "target", "required": true }] },
        "title": { "args": [{ "name": "target", "type": "target", "required": true }, { "name": "location", "type": "text", "enum": ["title", "subtitle", "actionbar"], "required": true }, { "name": "text", "type": "text", "required": true }] },
        "xp": { "args": [{ "name": "amount", "type": "text", "required": true, "placeholder": "50 or 5L" }, { "name": "target", "type": "target", "required": false }] }
    };

    function validateAndGenerate() {
        errorContainer.innerHTML = '';
        errorContainer.style.display = 'none';
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

        const errors = [];
        const selectedCommand = commandSelector.value;
        if (!selectedCommand) {
            commandOutput.value = '';
            return;
        }

        let commandString = `/${selectedCommand}`;
        const commandDef = commands[selectedCommand];

        if (commandDef.type === 'builder' && selectedCommand === 'execute') {
            const executeChain = [];
            const subCommandElements = document.querySelectorAll('.execute-sub-command');
            subCommandElements.forEach((subEl, index) => {
                const subType = subEl.querySelector('.execute-sub-command-type').value;
                if (!subType) {
                    errors.push(`Execute subcommand #${index + 1} is missing its type.`);
                    subEl.querySelector('.execute-sub-command-type').classList.add('input-error');
                    return;
                }

                let subCommandPart = subType;
                const subCommandDef = commandDef.subcommands[subType];
                const subArgsContainer = subEl.querySelector('.execute-sub-command-args');

                if (subCommandDef.dynamicArgs) {
                    const conditionType = subArgsContainer.querySelector('.condition-type-select') ? subArgsContainer.querySelector('.condition-type-select').value : null;
                    if (!conditionType) {
                        errors.push(`Execute subcommand '${subType}' #${index + 1} is missing its condition type.`);
                        subArgsContainer.querySelector('.condition-type-select').classList.add('input-error');
                        return;
                    }
                    subCommandPart += ` ${conditionType}`;
                    const dynamicArgs = subCommandDef.dynamicArgs[conditionType];
                    dynamicArgs.forEach(arg => {
                        const argValue = getInputValue(subArgsContainer, arg);
                        if (arg.required && !argValue) {
                            errors.push(`Execute subcommand '${subType}' argument '${arg.name}' is required.`);
                            highlightInput(subArgsContainer, arg);
                        }
                        if (argValue) subCommandPart += ` ${argValue}`;
                    });
                } else {
                    subCommandDef.args.forEach(arg => {
                        const argValue = getInputValue(subArgsContainer, arg);
                        if (arg.required && !argValue) {
                            errors.push(`Execute subcommand '${subType}' argument '${arg.name}' is required.`);
                            highlightInput(subArgsContainer, arg);
                        }
                        if (argValue) subCommandPart += ` ${argValue}`;
                    });
                }
                executeChain.push(subCommandPart);
            });

            const runCommandSelector = document.getElementById('execute-run-command-selector');
            const runCommandName = runCommandSelector.value;
            if (!runCommandName) {
                errors.push('The /execute command requires a command to run.');
                runCommandSelector.classList.add('input-error');
            } else {
                const runCommandDef = commands[runCommandName];
                let runCommandString = runCommandName;
                const runOptionsContainer = document.getElementById('execute-run-command-options');

                runCommandDef.args.forEach(arg => {
                    const argValue = getInputValue(runOptionsContainer, arg);
                    if (arg.required && !argValue) {
                        errors.push(`Run command '/${runCommandName}' argument '${arg.name}' is required.`);
                        highlightInput(runOptionsContainer, arg);
                    }
                    if (argValue) runCommandString += ` ${argValue}`;
                });
                executeChain.push(`run ${runCommandString}`);
            }

            commandString += ` ${executeChain.join(' ')}`;

        } else {
            for (const arg of commandDef.args) {
                const argContainer = document.getElementById(`arg-container-${arg.name}`);
                if (!argContainer) continue;

                let valuePresent = false;
                let argValue = getInputValue(argContainer, arg);

                if (arg.type === 'target') {
                    const selector = argContainer.querySelector('select').value;
                    let params = [];
                    const paramContainers = argContainer.querySelectorAll('.selector-param-container');
                    paramContainers.forEach(pc => {
                        const keyEl = pc.querySelector('.param-key');
                        const key = keyEl.value;
                        if (!key) return;

                        if (key === 'hasitem' || key === 'haspermission' || key === 'scores') {
                            let obj = {};
                            let isObjComplete = false;
                            const itemInputs = pc.querySelectorAll('.param-value-group input, .param-value-group select');
                            itemInputs.forEach(input => {
                                if (input.value) {
                                    obj[input.dataset.key] = input.value;
                                    isObjComplete = true;
                                }
                            });
                            if(isObjComplete) params.push(`${key}=${JSON.stringify(obj)}`);
                        } else {
                            const valueEl = pc.querySelector('.param-value');
                            const value = valueEl.value;
                            if (value) {
                                params.push(`${key}=${value}`);
                            } else if (arg.required) {
                                errors.push(`Parameter '${key}' for target '${arg.name}' requires a value.`);
                                valueEl.classList.add('input-error');
                            }
                        }
                    });
                    commandString += ` ${selector}${params.length > 0 ? `[${params.join(',')}]` : ''}`;
                    valuePresent = true; // Target selector always has a value (@p, etc)
                } else if (arg.type === 'coords') {
                    const inputs = argContainer.querySelectorAll('input');
                    const coords = Array.from(inputs).map(i => i.value || '~').join(' ');
                    if (coords.replace(/[~ ]/g, '') !== '') {
                        commandString += ` ${coords}`;
                        valuePresent = true;
                    }
                } else {
                    if (arg.type === 'json') {
                        try {
                            if (argValue) JSON.parse(argValue);
                        } catch (e) {
                            errors.push(`Invalid JSON in '${arg.name}': ${e.message}`);
                            argContainer.querySelector('input, select').classList.add('input-error');
                        }
                    }
                    if (argValue) {
                        commandString += ` ${argValue}`;
                        valuePresent = true;
                    }
                }

                if (arg.required && !valuePresent) {
                    errors.push(`Argument '${arg.name}' is required.`);
                    highlightInput(argContainer, arg);
                }
            }
        }

        if (errors.length > 0) {
            const errorList = document.createElement('ul');
            errors.forEach(err => {
                const li = document.createElement('li');
                li.textContent = err;
                errorList.appendChild(li);
            });
            errorContainer.appendChild(errorList);
            errorContainer.style.display = 'block';
            commandOutput.value = 'Error: Please fix the issues above.';
        } else {
            commandOutput.value = commandString;
        }
    }

    function getInputValue(container, argDef) {
        if (argDef.type === 'target') {
            const selector = container.querySelector('select').value;
            const params = [];
            container.querySelectorAll('.selector-param-container').forEach(pc => {
                const key = pc.querySelector('.param-key').value;
                if (!key) return;
                if (key === 'hasitem' || key === 'haspermission' || key === 'scores') {
                    let obj = {};
                    pc.querySelectorAll('.param-value-group input, .param-value-group select').forEach(input => {
                        if (input.value) obj[input.dataset.key] = input.value;
                    });
                    if (Object.keys(obj).length > 0) params.push(`${key}=${JSON.stringify(obj)}`);
                } else {
                    const value = pc.querySelector('.param-value').value;
                    if (value) params.push(`${key}=${value}`);
                }
            });
            return `${selector}${params.length > 0 ? `[${params.join(',')}]` : ''}`;
        } else if (argDef.type === 'coords') {
            const inputs = container.querySelectorAll('input');
            return Array.from(inputs).map(i => i.value || '~').join(' ');
        } else if (argDef.type === 'boolean') {
            return container.querySelector('select').value;
        } else if (argDef.enum) {
            return container.querySelector('select').value;
        } else {
            const input = container.querySelector('input, textarea');
            return input ? input.value : '';
        }
    }

    function highlightInput(container, argDef) {
        if (argDef.type === 'coords') {
            container.querySelectorAll('input').forEach(input => input.classList.add('input-error'));
        } else if (argDef.type === 'target') {
            container.querySelector('select').classList.add('input-error');
        } else {
            const input = container.querySelector('input, select, textarea');
            if (input) input.classList.add('input-error');
        }
    }

    function createCommandOptions() {
        const selectedCommand = commandSelector.value;
        commandOptionsContainer.innerHTML = '';
        if (!selectedCommand) {
            validateAndGenerate();
            return;
        }

        const commandDef = commands[selectedCommand];
        if (commandDef.type === 'builder' && selectedCommand === 'execute') {
            commandOptionsContainer.appendChild(createExecuteBuilder());
        } else {
            for (const arg of commandDef.args) {
                const container = document.createElement('div');
                container.className = 'command-option';
                container.id = `arg-container-${arg.name}`;

                const label = document.createElement('label');
                label.textContent = `${arg.name} ${arg.required ? '*' : ''}:`;
                container.appendChild(label);

                let element;
                switch (arg.type) {
                    case 'target':
                        element = createTargetSelector(arg);
                        break;
                    case 'coords':
                        element = createCoordsInput(arg);
                        break;
                    case 'boolean':
                        element = createBooleanInput(arg);
                        break;
                    case 'json':
                        element = createTextAreaInput(arg);
                        break;
                    case 'text':
                    case 'number':
                        if (arg.enum) {
                            element = createEnumInput(arg);
                        } else {
                            element = createTextInput(arg);
                        }
                        break;
                }
                container.appendChild(element);
                commandOptionsContainer.appendChild(container);
            }
        }
        validateAndGenerate();
    }

    function createTextInput(arg) {
        const input = document.createElement('input');
        input.type = arg.type === 'number' ? 'number' : 'text';
        input.placeholder = arg.placeholder || '';
        input.addEventListener('input', validateAndGenerate);
        return input;
    }

    function createTextAreaInput(arg) {
        const textarea = document.createElement('textarea');
        textarea.placeholder = arg.placeholder || '';
        textarea.addEventListener('input', validateAndGenerate);
        return textarea;
    }

    function createBooleanInput(arg) {
        const select = document.createElement('select');
        const trueOpt = document.createElement('option');
        trueOpt.value = 'true';
        trueOpt.textContent = 'True';
        const falseOpt = document.createElement('option');
        falseOpt.value = 'false';
        falseOpt.textContent = 'False';
        select.appendChild(trueOpt);
        select.appendChild(falseOpt);
        select.addEventListener('change', validateAndGenerate);
        return select;
    }
    
    function createEnumInput(arg) {
        const select = document.createElement('select');
        arg.enum.forEach(val => {
            const option = document.createElement('option');
            option.value = val;
            option.textContent = val;
            select.appendChild(option);
        });
        select.addEventListener('change', validateAndGenerate);
        return select;
    }

    function createCoordsInput(arg) {
        const wrapper = document.createElement('div');
        wrapper.className = 'coords-wrapper';
        ['x', 'y', 'z'].forEach(axis => {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = axis;
            input.addEventListener('input', validateAndGenerate);
            wrapper.appendChild(input);
        });
        return wrapper;
    }

    function createTargetSelector(arg) {
        const wrapper = document.createElement('div');
        const selectorRow = document.createElement('div');
        selectorRow.className = 'selector-row';

        const select = document.createElement('select');
        ["@p", "@r", "@a", "@e", "@s"].forEach(s => {
            const option = document.createElement('option');
            option.value = s;
            option.textContent = s;
            select.appendChild(option);
        });
        select.addEventListener('change', validateAndGenerate);
        selectorRow.appendChild(select);

        const addParamButton = document.createElement('button');
        addParamButton.textContent = '+ Add Parameter';
        addParamButton.className = 'add-param-button';
        selectorRow.appendChild(addParamButton);
        wrapper.appendChild(selectorRow);

        const paramsContainer = document.createElement('div');
        paramsContainer.className = 'params-container';
        wrapper.appendChild(paramsContainer);

        addParamButton.addEventListener('click', () => {
            paramsContainer.appendChild(createSelectorParam());
            validateAndGenerate();
        });

        return wrapper;
    }

    function createSelectorParam() {
        const container = document.createElement('div');
        container.className = 'selector-param-container';

        const keySelect = document.createElement('select');
        keySelect.className = 'param-key';
        const keys = ["", "x", "y", "z", "r", "rm", "dx", "dy", "dz", "c", "m", "name", "tag", "type", "scores", "hasitem", "haspermission"];
        keys.forEach(k => {
            const option = document.createElement('option');
            option.value = k;
            option.textContent = k;
            keySelect.appendChild(option);
        });
        container.appendChild(keySelect);

        const valueContainer = document.createElement('div');
        valueContainer.className = 'param-value-container';
        container.appendChild(valueContainer);

        keySelect.addEventListener('change', () => {
            valueContainer.innerHTML = '';
            const key = keySelect.value;
            if (!key) return;

            if (key === 'hasitem') {
                valueContainer.appendChild(createHasItemInput());
            } else if (key === 'scores') {
                valueContainer.appendChild(createScoresInput());
            } else if (key === 'haspermission') {
                valueContainer.appendChild(createHasPermissionInput());
            } else {
                const valueInput = document.createElement('input');
                valueInput.type = 'text';
                valueInput.className = 'param-value';
                valueInput.addEventListener('input', validateAndGenerate);
                valueContainer.appendChild(valueInput);
            }
            validateAndGenerate();
        });

        const removeButton = document.createElement('button');
        removeButton.textContent = 'X';
        removeButton.className = 'remove-param-button';
        removeButton.addEventListener('click', () => {
            container.remove();
            validateAndGenerate();
        });
        container.appendChild(removeButton);

        return container;
    }

    function createHasItemInput() {
        const wrapper = document.createElement('div');
        wrapper.className = 'param-value-group';
        const inputs = [
            { key: 'item', type: 'text', placeholder: 'item name' },
            { key: 'quantity', type: 'text', placeholder: 'quantity (e.g., 1..5)' },
            { key: 'location', type: 'text', placeholder: 'location' },
            { key: 'slot', type: 'text', placeholder: 'slot number' },
            { key: 'data', type: 'number', placeholder: 'data value' }
        ];
        inputs.forEach(i => {
            const input = document.createElement('input');
            input.type = i.type;
            input.placeholder = i.placeholder;
            input.dataset.key = i.key;
            input.addEventListener('input', validateAndGenerate);
            wrapper.appendChild(input);
        });
        return wrapper;
    }

    function createScoresInput() {
        const wrapper = document.createElement('div');
        wrapper.className = 'param-value-group';
        const inputs = [
            { key: 'objective', type: 'text', placeholder: 'objective' },
            { key: 'min', type: 'number', placeholder: 'min score' },
            { key: 'max', type: 'number', placeholder: 'max score' }
        ];
        inputs.forEach(i => {
            const input = document.createElement('input');
            input.type = i.type;
            input.placeholder = i.placeholder;
            input.dataset.key = i.key;
            input.addEventListener('input', validateAndGenerate);
            wrapper.appendChild(input);
        });
        return wrapper;
    }
    
    function createHasPermissionInput() {
        const wrapper = document.createElement('div');
        wrapper.className = 'param-value-group';
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'permission name';
        input.dataset.key = 'permission';
        input.addEventListener('input', validateAndGenerate);
        wrapper.appendChild(input);
        return wrapper;
    }

    // --- Execute Command Builder Functions ---
    function createExecuteBuilder() {
        const wrapper = document.createElement('div');
        wrapper.id = 'execute-builder';
        wrapper.innerHTML = `
            <div id="execute-sub-commands-container"></div>
            <button type="button" id="add-execute-sub-command">+ Add Sub-Command</button>
            <div class="run-command-container">
                <label>Run Command:</label>
                <select id="execute-run-command-selector"><option value="">--Choose command--</option></select>
                <div id="execute-run-command-options"></div>
            </div>
        `;

        const subCommandsContainer = wrapper.querySelector('#execute-sub-commands-container');
        const addButton = wrapper.querySelector('#add-execute-sub-command');
        const runCommandSelector = wrapper.querySelector('#execute-run-command-selector');
        const runOptionsContainer = wrapper.querySelector('#execute-run-command-options');

        // Populate the run command selector
        const commandNames = Object.keys(commands).sort();
        commandNames.forEach(name => {
            if (name === 'execute') return; // Prevent infinite recursion
            const option = document.createElement('option');
            option.value = name;
            option.textContent = `/${name}`;
            runCommandSelector.appendChild(option);
        });

        addButton.addEventListener('click', () => {
            subCommandsContainer.appendChild(createExecuteSubCommand());
            validateAndGenerate();
        });
        
        runCommandSelector.addEventListener('change', () => {
            const selected = runCommandSelector.value;
            runOptionsContainer.innerHTML = '';
            if (!selected) {
                validateAndGenerate();
                return;
            }

            const commandDef = commands[selected];
            commandDef.args.forEach(arg => {
                const container = document.createElement('div');
                container.className = 'command-option';
                container.id = `execute-run-arg-container-${arg.name}`;

                const label = document.createElement('label');
                label.textContent = `${arg.name} ${arg.required ? '*' : ''}:`;
                container.appendChild(label);

                let element;
                switch (arg.type) {
                    case 'target': element = createTargetSelector(arg); break;
                    case 'coords': element = createCoordsInput(arg); break;
                    case 'boolean': element = createBooleanInput(arg); break;
                    case 'json': element = createTextAreaInput(arg); break;
                    case 'text':
                    case 'number':
                        if (arg.enum) { element = createEnumInput(arg); } else { element = createTextInput(arg); }
                        break;
                }
                container.appendChild(element);
                runOptionsContainer.appendChild(container);
            });
            validateAndGenerate();
        });

        return wrapper;
    }

    function createExecuteSubCommand() {
        const subCommandWrapper = document.createElement('div');
        subCommandWrapper.className = 'execute-sub-command';

        const typeSelect = document.createElement('select');
        typeSelect.className = 'execute-sub-command-type';
        const subCommandTypes = Object.keys(commands.execute.subcommands).sort();
        typeSelect.innerHTML = '<option value="">--select type--</option>' + subCommandTypes.map(type => `<option value="${type}">${type}</option>`).join('');
        subCommandWrapper.appendChild(typeSelect);

        const argsContainer = document.createElement('div');
        argsContainer.className = 'execute-sub-command-args';
        subCommandWrapper.appendChild(argsContainer);

        const removeButton = document.createElement('button');
        removeButton.textContent = 'X';
        removeButton.className = 'remove-param-button';
        removeButton.addEventListener('click', () => {
            subCommandWrapper.remove();
            validateAndGenerate();
        });
        subCommandWrapper.appendChild(removeButton);

        typeSelect.addEventListener('change', () => {
            argsContainer.innerHTML = '';
            const selectedType = typeSelect.value;
            if (!selectedType) {
                validateAndGenerate();
                return;
            }

            const subCommandDef = commands.execute.subcommands[selectedType];

            if (subCommandDef.dynamicArgs) {
                const conditionTypeSelect = document.createElement('select');
                conditionTypeSelect.className = 'condition-type-select';
                conditionTypeSelect.innerHTML = '<option value="">--select condition--</option>' + Object.keys(subCommandDef.dynamicArgs).map(type => `<option value="${type}">${type}</option>`).join('');
                argsContainer.appendChild(conditionTypeSelect);

                const dynamicArgsContainer = document.createElement('div');
                dynamicArgsContainer.className = 'dynamic-args-container';
                argsContainer.appendChild(dynamicArgsContainer);

                conditionTypeSelect.addEventListener('change', () => {
                    dynamicArgsContainer.innerHTML = '';
                    const selectedCondition = conditionTypeSelect.value;
                    if (!selectedCondition) {
                        validateAndGenerate();
                        return;
                    }
                    subCommandDef.dynamicArgs[selectedCondition].forEach(arg => {
                        dynamicArgsContainer.appendChild(createExecuteSubArgInput(arg));
                    });
                    validateAndGenerate();
                });
            } else {
                subCommandDef.args.forEach(arg => {
                    argsContainer.appendChild(createExecuteSubArgInput(arg));
                });
            }
            validateAndGenerate();
        });

        return subCommandWrapper;
    }

    function createExecuteSubArgInput(arg) {
        const container = document.createElement('div');
        container.className = 'execute-sub-arg-input';
        container.id = `execute-sub-arg-container-${arg.name}`;

        const label = document.createElement('label');
        label.textContent = `${arg.name} ${arg.required ? '*' : ''}:`;
        container.appendChild(label);

        let element;
        switch (arg.type) {
            case 'target': element = createTargetSelector(arg); break;
            case 'coords': element = createCoordsInput(arg); break;
            case 'boolean': element = createBooleanInput(arg); break;
            case 'json': element = createTextAreaInput(arg); break;
            case 'text':
            case 'number':
                if (arg.enum) { element = createEnumInput(arg); } else { element = createTextInput(arg); }
                break;
        }
        container.appendChild(element);
        return container;
    }

    function populateCommandSelector() {
        const commandNames = Object.keys(commands).sort();
        commandNames.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = `/${name}`;
            commandSelector.appendChild(option);
        });
    }

    copyButton.addEventListener('click', () => {
        commandOutput.select();
        document.execCommand('copy');
    });

    commandSelector.addEventListener('change', createCommandOptions);

    populateCommandSelector();
    createCommandOptions();
});
