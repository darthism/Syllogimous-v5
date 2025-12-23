const EMOJI_LENGTH = 50;
const JUNK_EMOJI_COUNT = 1000;
class JunkEmojis {
    constructor() {
        this.id = 0;
        this.prevColor = null;
        this.pool = JunkEmojis.generateColorPool();
    }

    static shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
        }
        return array;
    }

    static perfectShuffle(arr, groupCount) {
        let groups = Array.from({ length: groupCount }, () => []);

        for (let i = 0; i < arr.length; i++) {
            groups[i % groupCount].push(arr[i]);
        }

        return [].concat(...groups);
    }

    static zipShuffle(arrays) {
        const maxLength = Math.max(...arrays.map(arr => arr.length));
    
        const result = [];
        for (let i = 0; i < maxLength; i++) {
            const group = arrays.map(arr => arr?.[i]).filter(x => x !== undefined);
            const splits = pickRandomItems([3,4,5,6,7,8,9], 1).picked[0];
            result.push(JunkEmojis.perfectShuffle(group, splits));
        }
    
        return result.flat();
    }

    static generateColorPool() {
        const colors = [];

        const hueGroups = [];
        const hues = [0,10,20,30,40,45,50,55,60,65,70,80,90,100,115,130,145,160,170,180,190,200,210,220,230,237,244,250,260,270,280,290,295,300,305,310,320,330,340,350];
        const saturationsA = [10, 100, 25, 75, 95, 38, 85, 43, 68, 47, 55, 50];
        const saturationsB = saturationsA.slice().reverse();
        const lightA = [12, 92, 22, 82, 32, 77, 42, 67, 54, 59];
        const lightB = lightA.slice().reverse();
        let lightnesses = lightA;
        let saturations = saturationsA;

        for (const hue of hues) {
            const group = [];
            lightnesses = (lightnesses == lightA) ? lightB : lightA;
            saturations = (saturations == saturationsA) ? saturationsB : saturationsA;
            for (const sat of saturations) {
                const saturation = Math.round(sat + (Math.random() - 0.5) * 6);
                for (const light of lightnesses) {
                    const lightness = Math.round(light + (Math.random() - 0.5) * 6);
                    if (85 < hue && hue < 150 && (lightness <= 30 || saturation <= 30)) {
                        // Puke green is not kawaii
                        continue;
                    }
                    if (Math.random() < 0.01) {
                        group.push(`hsl(${hue}, ${saturation}%, ${0}%)`);
                    } else if (Math.random() < 0.005) {
                        group.push(`hsl(${hue}, ${saturation}%, ${100}%)`);
                    } else {
                        group.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
                    }
                }
            }
            hueGroups.push(group);
        }

        return JunkEmojis.zipShuffle(hueGroups);
    }

    static generateRandomPoints(minX, maxX, minY, maxY, numPoints, minDistance) {
        const points = [];
        const width = maxX - minX;
        const height = maxY - minY;

        const isFarEnough = (x, y) => {
            for (const [px, py] of points) {
                const dx = px - x;
                const dy = py - y;
                if (Math.sqrt(dx * dx + dy * dy) < minDistance) {
                    return false;
                }
            }
            return true;
        };

        const usePerpendicularShifts = oneOutOf(7);
        let usedX = coinFlip();
        for (let tries = 0; tries < 1000 && points.length < numPoints; tries++) {
            let x = minX + Math.random() * width;
            let y = minY + Math.random() * height;
            if (usePerpendicularShifts && points.length > 0) {
                if (usedX) {
                    if (Math.random() < 0.8) {
                        y = points[points.length - 1][1];
                        usedX = false;
                    } else {
                        x = points[points.length - 1][0];
                        usedX = true;
                    }
                } else {
                    if (Math.random() < 0.2) {
                        y = points[points.length - 1][1];
                        usedX = false;
                    } else {
                        x = points[points.length - 1][0];
                        usedX = true;
                    }
                }
            }

            if (isFarEnough(x, y)) {
                points.push([x, y]);
            }
        }

        return points;
    }

    rebuildPool() {
        this.pool = JunkEmojis.generateColorPool();
    }

    bumpId() {
        this.id += 1;
        if (this.id % this.pool.length == 0) {
            this.rebuildPool();
        }
    }

    nextColor() {
        let color = this.pool[this.id % this.pool.length];
        while (this.prevColor && ColorComparator.areSimilarHslColors(color, this.prevColor)) {
            this.bumpId();
            this.prevColor = color;
            color = this.pool[this.id % this.pool.length];
        }
        this.bumpId();
        this.prevColor = color;
        return color;
    }

    generateJunkEmoji(colors, id=-1) {
        const width = EMOJI_LENGTH, height = EMOJI_LENGTH;
        const numPoints = colors.length;
        const points = JunkEmojis.generateRandomPoints(3, width-3, 3, height-3, numPoints, 5);
        const voronoi = d3.Delaunay.from(points).voronoi([0, 0, width, height]);
        let svgContent = `<symbol id="junk-${id}" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 ${width} ${height}">`;

        for (let i = 0; i < points.length; i++) {
            const color = colors[i];
            const cell = voronoi.cellPolygon(i);
            if (cell) {
                const pointsString = cell.map(([x, y]) => `${Math.round(x)},${Math.round(y)}`).join(' ');
                svgContent += `<polygon points="${pointsString}" fill="${color}" />`;
            }
        }

        svgContent += '</symbol>';
        return svgContent;
    }

    parseHSL(hsl) {
        let match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        return match ? match.slice(1).map(Number) : [0, 0, 0];
    }

    generateAllEmoji() {
        let colorCombos = [];
        for (let i = 0; i < JUNK_EMOJI_COUNT; i++) {
            const numColors = pickRandomItems([2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5], 1).picked[0];
            let combo = [];
            for (let j = 0; j < numColors; j++) {
                combo.push(this.nextColor());
            }
            colorCombos.push(combo);
        }

        colorCombos.sort((a, b) => {
            const [u, v, w] = this.parseHSL(a[0]);
            const [x, y, z] = this.parseHSL(b[0]);
            return u - x || v - y || w - z;
        })

        let s = '<svg style="display: none;">\n';
        s += '<defs>\n';
        let id = 0;
        for (const combo of colorCombos) {
            const svg = this.generateJunkEmoji(combo, id);
            s += svg + '\n';
            id++;
        }
        s += '</defs>\n';
        s += '</svg>\n';
        return s;
    }
}

// To generate:
// console.log(new JunkEmojis(JUNK_EMOJI_COUNT + 1).generateAllEmoji());
// document.addEventListener("DOMContentLoaded", throwSvgsOnPage);

function throwSvgsOnPage() {
    let symbols = Array.from(document.querySelectorAll("symbol"));
    let container = document.createElement("div");
    container.id = "svg-container";

    symbols.forEach((symbol, i) => {
        if (i % (JUNK_EMOJI_COUNT / 10) === 0) {
            let divider = document.createElement("div");
            divider.setAttribute("style", "display: inline-block; width: 10px; height: 50px; border: 3px dotted black; background-color: #FFF");
            container.appendChild(divider);
        }
        let useElement = document.createElementNS("http://www.w3.org/2000/svg", "use");
        useElement.setAttributeNS("http://www.w3.org/1999/xlink", "href", `#${symbol.id}`);

        let svgWrapper = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgWrapper.setAttribute("viewBox", symbol.getAttribute("viewBox"));
        svgWrapper.setAttribute("width", "50");
        svgWrapper.setAttribute("height", "50");
        svgWrapper.appendChild(useElement);
        container.appendChild(svgWrapper);

    });

    document.body.appendChild(container);
}

function generateTopoSvg(seed) {
    // Seeded random for consistent output
    let state = seed % (2 ** 31 - 1);
    const random = () => {
        state = (48271 * state) % (2 ** 31 - 1);
        return state / (2 ** 31 - 1);
    };

    const width = 100, height = 50;
    const layers = 8 + Math.floor(random() * 6); // 8-13 contour layers for more detail
    
    // Generate a color palette based on seed (earth tones, ocean blues, or forest greens)
    const palettes = [
        // Earth/terrain
        ['#2d5016', '#3d6b1c', '#4a7c23', '#5d9a2a', '#7cb342', '#95c45a', '#aed581', '#c5e1a5', '#dcedc8', '#e8f5e9', '#fff8e1', '#ffe0b2'],
        // Ocean depth  
        ['#0a3d91', '#0d47a1', '#1256b0', '#1565c0', '#1873c9', '#1976d2', '#2196f3', '#42a5f5', '#64b5f6', '#90caf9', '#bbdefb', '#e3f2fd'],
        // Desert/canyon
        ['#2e1f1a', '#3e2723', '#4e342e', '#5d4037', '#6d4c41', '#795548', '#8d6e63', '#a1887f', '#bcaaa4', '#d7ccc8', '#efebe9', '#fff3e0'],
        // Forest
        ['#0d3d0f', '#1b5e20', '#257a28', '#2e7d32', '#338536', '#388e3c', '#43a047', '#4caf50', '#66bb6a', '#81c784', '#a5d6a7', '#c8e6c9'],
        // Volcanic
        ['#7f0000', '#9a0007', '#b71c1c', '#c62828', '#d32f2f', '#e53935', '#ef5350', '#e57373', '#ef9a9a', '#ffcdd2', '#616161', '#9e9e9e'],
    ];
    
    const palette = palettes[Math.floor(random() * palettes.length)];
    
    // Generate contour center points - can have multiple peaks
    const numPeaks = 1 + Math.floor(random() * 2); // 1-2 peaks
    const peaks = [];
    for (let p = 0; p < numPeaks; p++) {
        peaks.push({
            x: 15 + random() * 70,
            y: 10 + random() * 30
        });
    }
    
    let svg = `<svg class="topo-stimulus" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
    
    // Background
    svg += `<rect width="${width}" height="${height}" fill="${palette[palette.length - 1]}"/>`;
    
    // Draw contour layers from largest to smallest
    for (let i = 0; i < layers; i++) {
        const colorIdx = Math.min(Math.floor(i * palette.length / layers), palette.length - 1);
        const baseRadius = (layers - i) * (Math.min(width, height) / (layers + 2));
        
        // Create irregular contour path with more segments for detail
        const points = [];
        const segments = 18 + Math.floor(random() * 12); // More segments for smoother, detailed contours
        
        for (let j = 0; j < segments; j++) {
            const angle = (j / segments) * Math.PI * 2;
            // Add variation based on multiple peaks
            let radiusVar = baseRadius * (0.5 + random() * 0.6);
            
            // Blend influence from all peaks
            let px = 0, py = 0, totalWeight = 0;
            for (const peak of peaks) {
                const weight = 1 / (peaks.length);
                px += (peak.x + Math.cos(angle) * radiusVar * 1.8) * weight;
                py += (peak.y + Math.sin(angle) * radiusVar) * weight;
                totalWeight += weight;
            }
            px /= totalWeight / peaks.length;
            py /= totalWeight / peaks.length;
            
            // Add extra noise for more natural look
            px += (random() - 0.5) * 4;
            py += (random() - 0.5) * 2;
            
            points.push({ x: px, y: py });
        }
        
        // Create smooth path through points
        let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
        for (let j = 0; j < points.length; j++) {
            const p0 = points[j];
            const p1 = points[(j + 1) % points.length];
            const midX = (p0.x + p1.x) / 2;
            const midY = (p0.y + p1.y) / 2;
            path += ` Q ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} ${midX.toFixed(1)} ${midY.toFixed(1)}`;
        }
        path += ' Z';
        
        // Draw filled area with black contour line
        svg += `<path d="${path}" fill="${palette[colorIdx]}" stroke="#000000" stroke-width="0.8"/>`;
    }
    
    svg += '</svg>';
    return svg;
}

function renderJunkEmojisText(text) {
    text = text.replaceAll(/\[junk\](\d+)\[\/junk\]/gi, (match, id) => {
        let s = `<svg class="junk" width="${EMOJI_LENGTH}" height="${EMOJI_LENGTH}">`;
        s += `<use xlink:href="#junk-${id}"></use>`;
        s += '</svg>';
        return s;
    });

    text = text.replaceAll(/\[vnoise\](\d+),(\d+)\[\/vnoise\]/gi, (match, seed, splits) => {
        return new VisualNoise().generateVisualNoise(parseInt(seed), parseInt(splits));
    });

    text = text.replaceAll(/\[art\](\d+)\[\/art\]/gi, (match, id) => {
        // Use Lorem Picsum for random art images, seeded by ID for consistency
        const imageId = parseInt(id) % 1000; // Picsum has ~1000 images
        return `<img class="art-stimulus" src="https://picsum.photos/seed/${id}/100/50" alt="Art ${imageId}" loading="eager" crossorigin="anonymous">`;
    });

    text = text.replaceAll(/\[topo\](\d+)\[\/topo\]/gi, (match, id) => {
        return generateTopoSvg(parseInt(id));
    });

    text = text.replaceAll(/\[svg\](\d+)\[\/svg\]/gi, (match, id) => {
        return REUSABLE_SVGS[id];
    });

    return text;
}

function renderJunkEmojis(question) {
    question = structuredClone(question);
    if (question.bucket) {
        question.bucket = question.bucket.map(renderJunkEmojisText);
    }

    if (question.buckets) {
        question.buckets = question.buckets.map(bucket => bucket.map(renderJunkEmojisText));
    }

    if (question.wordCoordMap) {
        const words = Object.keys(question.wordCoordMap);
        for (const word of words) {
            const rendered = renderJunkEmojisText(word);
            if (rendered.length !== word.length) {
                question.wordCoordMap[rendered] = question.wordCoordMap[word];
                delete question.wordCoordMap[word];
            }
        }
    }

    if (question.subresults) {
        question.subresults = question.subresults.map(renderJunkEmojis);
    }

    if (question.premises) {
        question.premises = question.premises.map(renderJunkEmojisText);
    }

    if (question.operations) {
        question.operations = question.operations.map(renderJunkEmojisText);
    }

    if (question.conclusion) {
        question.conclusion = renderJunkEmojisText(question.conclusion);
    }

    return question;
}

