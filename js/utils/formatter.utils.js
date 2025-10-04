/**
 * © 2025 Typerflip. All rights reserved.
 * 
 * This software is provided under a proprietary license.
 * You may use this software for personal and educational purposes only.
 * Commercial use, modification, and redistribution are strictly prohibited
 * without explicit written permission.
 * 
 * For licensing inquiries: syscodev@proton.me
 * License violations will be prosecuted to the full extent of the law.
 * 
 * AUTHOR: Jose Fco. López (aka Sysco)
 *      Github:     [ https://github.com/Syyysco ] @Syyysco
 *      Portfolio:  [ https://syyysco.github.io ]
 * 
 * APP: Typerflip - Social editor:
 *      Repo:       [ https://github.com/Syyysco/Typerflip ]
 *      Web:        [ https://Syyysco.github.io/Typerflip ]
 * 
 */

import { specialChars } from "../data/formatter.data.js";

/**
 * Convert text using special characters
 *
 * @export
 * @param {string} text - input text
 * @param {string} type - type of special char
 * @returns {string} output text (converted)
 */
export function convertToSpecialChars(text, type) {
    if (type === 'listBullet') return specialChars.listBullet;
    if (type === 'listBulletMax') return specialChars.listBulletMax;
    if (type === 'indent') return specialChars.indent;

    if (type === 'listNumbers') {
        return text.replace(/\d/g, (match) => {
            const index = parseInt(match);
            return specialChars.listNumbers[index] || match;
        });
    }

    const mapping = specialChars[type];
    if (!mapping) return text;

    let result = text;
    mapping.forEach((specialChar, normalChar) => {
        const escapedChar = normalChar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        result = result.replace(new RegExp(escapedChar, 'g'), specialChar);
    });

    return result;
}

/**
 * Process inline formats
 *
 * @export
 * @param {string} line - raw line
 * @returns {string} formatted line
 */
export function processFormattingInLine(line) {
    let result = line;
    
    // Primero, procesar todas las combinaciones de formato SIN tocar los códigos inline
    // Combinaciones complejas
    result = result.replace(/\*\*([^*]*?)\*([^*]+?)\*([^*]*?)\*\*/g, (match, before, cursive, after) => {
        const boldBefore = convertToSpecialChars(before, 'bold');
        const boldItalicMiddle = convertToSpecialChars(cursive, 'boldItalic');
        const boldAfter = convertToSpecialChars(after, 'bold');
        return boldBefore + boldItalicMiddle + boldAfter;
    });

    result = result.replace(/\*([^*]*?)\*\*([^*]+?)\*\*([^*]*?)\*/g, (match, before, bold, after) => {
        const italicBefore = convertToSpecialChars(before, 'italic');
        const boldItalicMiddle = convertToSpecialChars(bold, 'boldItalic');
        const italicAfter = convertToSpecialChars(after, 'italic');
        return italicBefore + boldItalicMiddle + italicAfter;
    });

    // ***texto***
    result = result.replace(/\*\*\*([^*]+?)\*\*\*/g, (match, content) => {
        return convertToSpecialChars(content, 'boldItalic');
    });

    // **texto**
    result = result.replace(/\*\*([^*]+?)\*\*/g, (match, content) => {
        return convertToSpecialChars(content, 'bold');
    });

    // *texto*
    result = result.replace(/\*([^*\n]+?)\*/g, (match, content) => {
        return convertToSpecialChars(content, 'italic');
    });

    // DESPUÉS procesar códigos inline (al final para que no interfieran)
    result = result.replace(/`([^`\n]+?)`/g, (match, content) => {
        return convertToSpecialChars(content, 'code');
    });

    return result;
}


/**
 * Main handler to format text
 *
 * @export
 * @param {string} text - Raw text
 * @returns {string} - Formatted text
 */
export function formatText(text) {
    let processedText = text;
    const multilineCodeBlocks = [];
    let codeBlockIndex = 0;

    // Extraer y proteger bloques de código multilínea
    processedText = processedText.replace(/```([\s\S]*?)```/g, (match, content) => {
        const placeholder = `__MULTILINE_CODE_${codeBlockIndex}__`;
        let processedCodeContent = content.trim();
        const codeLines = processedCodeContent.split('\n');
        const processedCodeLines = codeLines.map(codeLine => {
            // Aplicar indentación solo a líneas que empiecen con ".."
            return codeLine.replace(/^(\.\.+)\s/, (match, arrows) => {
                const bullet = convertToSpecialChars('', 'indent');
                return bullet.repeat(arrows.length) + ' ';
            });
        });
        processedCodeContent = processedCodeLines.join('\n');
        multilineCodeBlocks[codeBlockIndex] = convertToSpecialChars(processedCodeContent, 'code');
        codeBlockIndex++;
        return placeholder;
    });

    // Primero procesar formato en línea en todo el texto
    // Procesar formato en línea manteniendo los placeholders de código multilínea intactos
    let formattedText = processedText;

    // Procesar formato línea por línea para evitar conflictos con placeholders multilínea
    const tempLines = formattedText.split('\n');
    const formattedLines = tempLines.map(line => {
        // No procesar líneas que contienen placeholders de código multilínea
        if (line.includes('__MULTILINE_CODE_')) {
            return line;
        }
        return processFormattingInLine(line);
    });
    formattedText = formattedLines.join('\n');

    // Luego procesar línea por línea para listas e indentaciones
    const lines = formattedText.split('\n');
    const processedLines = lines.map(line => {
        // No procesar líneas que contienen placeholders de código
        if (line.includes('__MULTILINE_CODE_') || line.includes('__CODE_BLOCK_')) {
            return line;
        }

        let processedLine = line;

        // Indentación
        processedLine = processedLine.replace(/^(\.\.+)\s/, (match, arrows) => {
            const bullet = convertToSpecialChars('', 'indent');
            return bullet.repeat(arrows.length) + ' ';
        });

        // Lista numerada
        processedLine = processedLine.replace(/^(\s*)(\d+)\.\s/, (match, spaces, number) => {
            const convertedNumber = convertToSpecialChars(number, 'listNumbers');
            return `${spaces}${convertedNumber}. `;
        });

        // Lista con guión
        processedLine = processedLine.replace(/^(\s*)-\s/, (match, spaces) => {
            const bullet = convertToSpecialChars('', 'listBullet');
            return `${spaces}${bullet} `;
        });

        // Lista con guión grande
        processedLine = processedLine.replace(/^(\s*)\+\s/, (match, spaces) => {
            const bullet = convertToSpecialChars('', 'listBulletMax');
            return `${spaces}${bullet} `;
        });

        return processedLine;
    });

    let result = processedLines.join('\n');

    // Restaurar bloques de código multilínea
    multilineCodeBlocks.forEach((codeContent, index) => {
        result = result.replace(`__MULTILINE_CODE_${index}__`, codeContent);
    });

    return result;
}