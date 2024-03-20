"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameGenerator = void 0;
class NameGenerator {
    static hash(n) {
        let h = n;
        for (let i = 0; i < 4; i++) {
            h = ((h << 5) - h + n) | 0;
            n = ((h << 7) - h + n) | 0;
        }
        return Math.abs(h);
    }
    static randomNameLength() {
        return Math.floor(Math.random() * (15 - 8 + 1)) + 8;
    }
    static GenerateNewName() {
        const name = [];
        let nameLength = this.randomNameLength();
        for (let i = 0; i < nameLength; i += 1) {
            let h = this.hash(this.Count + i);
            name.push(String.fromCharCode((Math.random() < 0.4 ? "A" : "a").charCodeAt(0) + (h % 26)));
        }
        const generatedName = name.join("");
        if (this.GeneratedNames.has(generatedName)) {
            return this.GenerateNewName();
        }
        this.GeneratedNames.add(generatedName);
        this.Count += 1;
        return generatedName;
    }
}
NameGenerator.Count = 0;
NameGenerator.GeneratedNames = new Set();
exports.NameGenerator = NameGenerator;
//# sourceMappingURL=NameGenerator.js.map