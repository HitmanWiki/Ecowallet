for (var lookup = [], revLookup = [], Arr = "undefined" != typeof Uint8Array ? Uint8Array : Array, code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", i = 0, len = code.length; i < len; ++i) lookup[i] = code[i], revLookup[code.charCodeAt(i)] = i;

function getLens(t) {
    var e = t.length;
    if (e % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
    var r = t.indexOf("=");
    return -1 === r && (r = e), [r, r === e ? 0 : 4 - r % 4]
}

function byteLength(t) {
    var e = getLens(t),
        r = e[0],
        n = e[1];
    return 3 * (r + n) / 4 - n
}

function _byteLength(t, e, r) {
    return 3 * (e + r) / 4 - r
}

function toByteArray(t) {
    var e, r, n = getLens(t),
        f = n[0],
        o = n[1],
        i = new Arr(_byteLength(t, f, o)),
        u = 0,
        s = o > 0 ? f - 4 : f;
    for (r = 0; r < s; r += 4) e = revLookup[t.charCodeAt(r)] << 18 | revLookup[t.charCodeAt(r + 1)] << 12 | revLookup[t.charCodeAt(r + 2)] << 6 | revLookup[t.charCodeAt(r + 3)], i[u++] = e >> 16 & 255, i[u++] = e >> 8 & 255, i[u++] = 255 & e;
    return 2 === o && (e = revLookup[t.charCodeAt(r)] << 2 | revLookup[t.charCodeAt(r + 1)] >> 4, i[u++] = 255 & e), 1 === o && (e = revLookup[t.charCodeAt(r)] << 10 | revLookup[t.charCodeAt(r + 1)] << 4 | revLookup[t.charCodeAt(r + 2)] >> 2, i[u++] = e >> 8 & 255, i[u++] = 255 & e), i
}

function tripletToBase64(t) {
    return lookup[t >> 18 & 63] + lookup[t >> 12 & 63] + lookup[t >> 6 & 63] + lookup[63 & t]
}

function encodeChunk(t, e, r) {
    for (var n, f = [], o = e; o < r; o += 3) n = (t[o] << 16 & 16711680) + (t[o + 1] << 8 & 65280) + (255 & t[o + 2]), f.push(tripletToBase64(n));
    return f.join("")
}

function fromByteArray(t) {
    for (var e, r = t.length, n = r % 3, f = [], o = 16383, i = 0, u = r - n; i < u; i += o) f.push(encodeChunk(t, i, i + o > u ? u : i + o));
    return 1 === n ? (e = t[r - 1], f.push(lookup[e >> 2] + lookup[e << 4 & 63] + "==")) : 2 === n && (e = (t[r - 2] << 8) + t[r - 1], f.push(lookup[e >> 10] + lookup[e >> 4 & 63] + lookup[e << 2 & 63] + "=")), f.join("")
}

function ieee754Read(t, e, r, n, f) {
    let o, i;
    const u = 8 * f - n - 1,
        s = (1 << u) - 1,
        h = s >> 1;
    let c = -7,
        a = r ? f - 1 : 0;
    const l = r ? -1 : 1;
    let p = t[e + a];
    for (a += l, o = p & (1 << -c) - 1, p >>= -c, c += u; c > 0;) o = 256 * o + t[e + a], a += l, c -= 8;
    for (i = o & (1 << -c) - 1, o >>= -c, c += n; c > 0;) i = 256 * i + t[e + a], a += l, c -= 8;
    if (0 === o) o = 1 - h;
    else {
        if (o === s) return i ? NaN : 1 / 0 * (p ? -1 : 1);
        i += Math.pow(2, n), o -= h
    }
    return (p ? -1 : 1) * i * Math.pow(2, o - n)
}

function ieee754Write(t, e, r, n, f, o) {
    let i, u, s, h = 8 * o - f - 1;
    const c = (1 << h) - 1,
        a = c >> 1,
        l = 23 === f ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
    let p = n ? 0 : o - 1;
    const w = n ? 1 : -1,
        y = e < 0 || 0 === e && 1 / e < 0 ? 1 : 0;
    for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (u = isNaN(e) ? 1 : 0, i = c) : (i = Math.floor(Math.log(e) / Math.LN2), e * (s = Math.pow(2, -i)) < 1 && (i--, s *= 2), (e += i + a >= 1 ? l / s : l * Math.pow(2, 1 - a)) * s >= 2 && (i++, s /= 2), i + a >= c ? (u = 0, i = c) : i + a >= 1 ? (u = (e * s - 1) * Math.pow(2, f), i += a) : (u = e * Math.pow(2, a - 1) * Math.pow(2, f), i = 0)); f >= 8;) t[r + p] = 255 & u, p += w, u /= 256, f -= 8;
    for (i = i << f | u, h += f; h > 0;) t[r + p] = 255 & i, p += w, i /= 256, h -= 8;
    t[r + p - w] |= 128 * y
}
revLookup["-".charCodeAt(0)] = 62, revLookup["_".charCodeAt(0)] = 63;
const customInspectSymbol = "function" == typeof Symbol && "function" == typeof Symbol.for ? Symbol.for("nodejs.util.inspect.custom") : null,
    INSPECT_MAX_BYTES = 50,
    K_MAX_LENGTH = 2147483647;

function typedArraySupport() {
    try {
        const t = new Uint8Array(1),
            e = {
                foo: function() {
                    return 42
                }
            };
        return Object.setPrototypeOf(e, Uint8Array.prototype), Object.setPrototypeOf(t, e), 42 === t.foo()
    } catch (t) {
        return !1
    }
}

function createBuffer(t) {
    if (t > 2147483647) throw new RangeError('The value "' + t + '" is invalid for option "size"');
    const e = new Uint8Array(t);
    return Object.setPrototypeOf(e, OwnBuffer.prototype), e
}

function OwnBuffer(t, e, r) {
    if ("number" == typeof t) {
        if ("string" == typeof e) throw new TypeError('The "string" argument must be of type string. Received type number');
        return allocUnsafe(t)
    }
    return from(t, e, r)
}

function from(t, e, r) {
    if ("string" == typeof t) return fromString(t, e);
    if (ArrayBuffer.isView(t)) return fromArrayView(t);
    if (null == t) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof t);
    if (isInstance(t, ArrayBuffer) || t && isInstance(t.buffer, ArrayBuffer)) return fromArrayBuffer(t, e, r);
    if ("undefined" != typeof SharedArrayBuffer && (isInstance(t, SharedArrayBuffer) || t && isInstance(t.buffer, SharedArrayBuffer))) return fromArrayBuffer(t, e, r);
    if ("number" == typeof t) throw new TypeError('The "value" argument must not be of type number. Received type number');
    const n = t.valueOf && t.valueOf();
    if (null != n && n !== t) return OwnBuffer.from(n, e, r);
    const f = fromObject(t);
    if (f) return f;
    if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof t[Symbol.toPrimitive]) return OwnBuffer.from(t[Symbol.toPrimitive]("string"), e, r);
    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof t)
}

function assertSize(t) {
    if ("number" != typeof t) throw new TypeError('"size" argument must be of type number');
    if (t < 0) throw new RangeError('The value "' + t + '" is invalid for option "size"')
}

function alloc(t, e, r) {
    return assertSize(t), t <= 0 ? createBuffer(t) : void 0 !== e ? "string" == typeof r ? createBuffer(t).fill(e, r) : createBuffer(t).fill(e) : createBuffer(t)
}

function allocUnsafe(t) {
    return assertSize(t), createBuffer(t < 0 ? 0 : 0 | checked(t))
}

function fromString(t, e) {
    if ("string" == typeof e && "" !== e || (e = "utf8"), !OwnBuffer.isEncoding(e)) throw new TypeError("Unknown encoding: " + e);
    const r = 0 | byteLength(t, e);
    let n = createBuffer(r);
    const f = n.write(t, e);
    return f !== r && (n = n.slice(0, f)), n
}

function fromArrayLike(t) {
    const e = t.length < 0 ? 0 : 0 | checked(t.length),
        r = createBuffer(e);
    for (let n = 0; n < e; n += 1) r[n] = 255 & t[n];
    return r
}

function fromArrayView(t) {
    if (isInstance(t, Uint8Array)) {
        const e = new Uint8Array(t);
        return fromArrayBuffer(e.buffer, e.byteOffset, e.byteLength)
    }
    return fromArrayLike(t)
}

function fromArrayBuffer(t, e, r) {
    if (e < 0 || t.byteLength < e) throw new RangeError('"offset" is outside of buffer bounds');
    if (t.byteLength < e + (r || 0)) throw new RangeError('"length" is outside of buffer bounds');
    let n;
    return n = void 0 === e && void 0 === r ? new Uint8Array(t) : void 0 === r ? new Uint8Array(t, e) : new Uint8Array(t, e, r), Object.setPrototypeOf(n, OwnBuffer.prototype), n
}

function fromObject(t) {
    if (OwnBuffer.isBuffer(t)) {
        const e = 0 | checked(t.length),
            r = createBuffer(e);
        return 0 === r.length || t.copy(r, 0, 0, e), r
    }
    return void 0 !== t.length ? "number" != typeof t.length || numberIsNaN(t.length) ? createBuffer(0) : fromArrayLike(t) : "Buffer" === t.type && Array.isArray(t.data) ? fromArrayLike(t.data) : void 0
}

function checked(t) {
    if (t >= 2147483647) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + 2147483647..toString(16) + " bytes");
    return 0 | t
}

function SlowBuffer(t) {
    return +t != t && (t = 0), OwnBuffer.alloc(+t)
}

function byteLength(t, e) {
    if (OwnBuffer.isBuffer(t)) return t.length;
    if (ArrayBuffer.isView(t) || isInstance(t, ArrayBuffer)) return t.byteLength;
    if ("string" != typeof t) throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof t);
    const r = t.length,
        n = arguments.length > 2 && !0 === arguments[2];
    if (!n && 0 === r) return 0;
    let f = !1;
    for (;;) switch (e) {
        case "ascii":
        case "latin1":
        case "binary":
            return r;
        case "utf8":
        case "utf-8":
            return utf8ToBytes(t).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
            return 2 * r;
        case "hex":
            return r >>> 1;
        case "base64":
            return base64ToBytes(t).length;
        default:
            if (f) return n ? -1 : utf8ToBytes(t).length;
            e = ("" + e).toLowerCase(), f = !0
    }
}

function slowToString(t, e, r) {
    let n = !1;
    if ((void 0 === e || e < 0) && (e = 0), e > this.length) return "";
    if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return "";
    if ((r >>>= 0) <= (e >>>= 0)) return "";
    for (t || (t = "utf8");;) switch (t) {
        case "hex":
            return hexSlice(this, e, r);
        case "utf8":
        case "utf-8":
            return utf8Slice(this, e, r);
        case "ascii":
            return asciiSlice(this, e, r);
        case "latin1":
        case "binary":
            return latin1Slice(this, e, r);
        case "base64":
            return base64Slice(this, e, r);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
            return utf16leSlice(this, e, r);
        default:
            if (n) throw new TypeError("Unknown encoding: " + t);
            t = (t + "").toLowerCase(), n = !0
    }
}

function swap(t, e, r) {
    const n = t[e];
    t[e] = t[r], t[r] = n
}

function bidirectionalIndexOf(t, e, r, n, f) {
    if (0 === OwnBuffer.length) return -1;
    if ("string" == typeof r ? (n = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), numberIsNaN(r = +r) && (r = f ? 0 : OwnBuffer.length - 1), r < 0 && (r = OwnBuffer.length + r), r >= OwnBuffer.length) {
        if (f) return -1;
        r = OwnBuffer.length - 1
    } else if (r < 0) {
        if (!f) return -1;
        r = 0
    }
    if ("string" == typeof e && (e = OwnBuffer.from(e, n)), OwnBuffer.isBuffer(e)) return 0 === e.length ? -1 : arrayIndexOf(t, e, r, n, f);
    if ("number" == typeof e) return e &= 255, "function" == typeof Uint8Array.prototype.indexOf ? f ? Uint8Array.prototype.indexOf.call(t, e, r) : Uint8Array.prototype.lastIndexOf.call(t, e, r) : arrayIndexOf(t, [e], r, n, f);
    throw new TypeError("val must be string, number or Buffer")
}

function arrayIndexOf(t, e, r, n, f) {
    let o, i = 1,
        u = t.length,
        s = e.length;
    if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
        if (t.length < 2 || e.length < 2) return -1;
        i = 2, u /= 2, s /= 2, r /= 2
    }

    function h(t, e) {
        return 1 === i ? t[e] : t.readUInt16BE(e * i)
    }
    if (f) {
        let n = -1;
        for (o = r; o < u; o++)
            if (h(t, o) === h(e, -1 === n ? 0 : o - n)) {
                if (-1 === n && (n = o), o - n + 1 === s) return n * i
            } else -1 !== n && (o -= o - n), n = -1
    } else
        for (r + s > u && (r = u - s), o = r; o >= 0; o--) {
            let r = !0;
            for (let n = 0; n < s; n++)
                if (h(t, o + n) !== h(e, n)) {
                    r = !1;
                    break
                }
            if (r) return o
        }
    return -1
}

function hexWrite(t, e, r, n) {
    r = Number(r) || 0;
    const f = t.length - r;
    n ? (n = Number(n)) > f && (n = f) : n = f;
    const o = e.length;
    let i;
    for (n > o / 2 && (n = o / 2), i = 0; i < n; ++i) {
        const n = parseInt(e.substr(2 * i, 2), 16);
        if (numberIsNaN(n)) return i;
        t[r + i] = n
    }
    return i
}

function utf8Write(t, e, r, n) {
    return blitBuffer(utf8ToBytes(e, t.length - r), t, r, n)
}

function asciiWrite(t, e, r, n) {
    return blitBuffer(asciiToBytes(e), t, r, n)
}

function base64Write(t, e, r, n) {
    return blitBuffer(base64ToBytes(e), t, r, n)
}

function ucs2Write(t, e, r, n) {
    return blitBuffer(utf16leToBytes(e, t.length - r), t, r, n)
}

function base64Slice(t, e, r) {
    return 0 === e && r === t.length ? fromByteArray(t) : fromByteArray(t.slice(e, r))
}

function utf8Slice(t, e, r) {
    r = Math.min(t.length, r);
    const n = [];
    let f = e;
    for (; f < r;) {
        const e = t[f];
        let o = null,
            i = e > 239 ? 4 : e > 223 ? 3 : e > 191 ? 2 : 1;
        if (f + i <= r) {
            let r, n, u, s;
            switch (i) {
                case 1:
                    e < 128 && (o = e);
                    break;
                case 2:
                    r = t[f + 1], 128 == (192 & r) && (s = (31 & e) << 6 | 63 & r, s > 127 && (o = s));
                    break;
                case 3:
                    r = t[f + 1], n = t[f + 2], 128 == (192 & r) && 128 == (192 & n) && (s = (15 & e) << 12 | (63 & r) << 6 | 63 & n, s > 2047 && (s < 55296 || s > 57343) && (o = s));
                    break;
                case 4:
                    r = t[f + 1], n = t[f + 2], u = t[f + 3], 128 == (192 & r) && 128 == (192 & n) && 128 == (192 & u) && (s = (15 & e) << 18 | (63 & r) << 12 | (63 & n) << 6 | 63 & u, s > 65535 && s < 1114112 && (o = s))
            }
        }
        null === o ? (o = 65533, i = 1) : o > 65535 && (o -= 65536, n.push(o >>> 10 & 1023 | 55296), o = 56320 | 1023 & o), n.push(o), f += i
    }
    return decodeCodePointsArray(n)
}
OwnBuffer.TYPED_ARRAY_SUPPORT = typedArraySupport(), OwnBuffer.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(OwnBuffer.prototype, "parent", {
    enumerable: !0,
    get: function() {
        if (OwnBuffer.isBuffer(this)) return this.buffer
    }
}), Object.defineProperty(OwnBuffer.prototype, "offset", {
    enumerable: !0,
    get: function() {
        if (OwnBuffer.isBuffer(this)) return this.byteOffset
    }
}), OwnBuffer.poolSize = 8192, OwnBuffer.from = function(t, e, r) {
    return from(t, e, r)
}, Object.setPrototypeOf(OwnBuffer.prototype, Uint8Array.prototype), Object.setPrototypeOf(OwnBuffer, Uint8Array), OwnBuffer.alloc = function(t, e, r) {
    return alloc(t, e, r)
}, OwnBuffer.allocUnsafe = function(t) {
    return allocUnsafe(t)
}, OwnBuffer.allocUnsafeSlow = function(t) {
    return allocUnsafe(t)
}, OwnBuffer.isBuffer = function(t) {
    return null != t && !0 === t._isBuffer && t !== OwnBuffer.prototype
}, OwnBuffer.compare = function(t, e) {
    if (isInstance(t, Uint8Array) && (t = OwnBuffer.from(t, t.offset, t.byteLength)), isInstance(e, Uint8Array) && (e = OwnBuffer.from(e, e.offset, e.byteLength)), !OwnBuffer.isBuffer(t) || !OwnBuffer.isBuffer(e)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
    if (t === e) return 0;
    let r = t.length,
        n = e.length;
    for (let f = 0, o = Math.min(r, n); f < o; ++f)
        if (t[f] !== e[f]) {
            r = t[f], n = e[f];
            break
        }
    return r < n ? -1 : n < r ? 1 : 0
}, OwnBuffer.isEncoding = function(t) {
    switch (String(t).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
            return !0;
        default:
            return !1
    }
}, OwnBuffer.concat = function(t, e) {
    if (!Array.isArray(t)) throw new TypeError('"list" argument must be an Array of Buffers');
    if (0 === t.length) return OwnBuffer.alloc(0);
    let r;
    if (void 0 === e)
        for (e = 0, r = 0; r < t.length; ++r) e += t[r].length;
    const n = OwnBuffer.allocUnsafe(e);
    let f = 0;
    for (r = 0; r < t.length; ++r) {
        let e = t[r];
        if (isInstance(e, Uint8Array)) f + e.length > OwnBuffer.length ? (OwnBuffer.isBuffer(e) || (e = OwnBuffer.from(e)), e.copy(n, f)) : Uint8Array.prototype.set.call(n, e, f);
        else {
            if (!OwnBuffer.isBuffer(e)) throw new TypeError('"list" argument must be an Array of Buffers');
            e.copy(n, f)
        }
        f += e.length
    }
    return n
}, OwnBuffer.byteLength = byteLength, OwnBuffer.prototype._isBuffer = !0, OwnBuffer.prototype.swap16 = function() {
    const t = this.length;
    if (t % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let e = 0; e < t; e += 2) swap(this, e, e + 1);
    return this
}, OwnBuffer.prototype.swap32 = function() {
    const t = this.length;
    if (t % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let e = 0; e < t; e += 4) swap(this, e, e + 3), swap(this, e + 1, e + 2);
    return this
}, OwnBuffer.prototype.swap64 = function() {
    const t = this.length;
    if (t % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let e = 0; e < t; e += 8) swap(this, e, e + 7), swap(this, e + 1, e + 6), swap(this, e + 2, e + 5), swap(this, e + 3, e + 4);
    return this
}, OwnBuffer.prototype.toString = function() {
    const t = this.length;
    return 0 === t ? "" : 0 === arguments.length ? utf8Slice(this, 0, t) : slowToString.apply(this, arguments)
}, OwnBuffer.prototype.toLocaleString = OwnBuffer.prototype.toString, OwnBuffer.prototype.equals = function(t) {
    if (!OwnBuffer.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
    return this === t || 0 === OwnBuffer.compare(this, t)
}, OwnBuffer.prototype.inspect = function() {
    let t = "";
    return t = this.toString("hex", 0, 50).replace(/(.{2})/g, "$1 ").trim(), this.length > 50 && (t += " ... "), "<Buffer " + t + ">"
}, customInspectSymbol && (OwnBuffer.prototype[customInspectSymbol] = OwnBuffer.prototype.inspect), OwnBuffer.prototype.compare = function(t, e, r, n, f) {
    if (isInstance(t, Uint8Array) && (t = OwnBuffer.from(t, t.offset, t.byteLength)), !OwnBuffer.isBuffer(t)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof t);
    if (void 0 === e && (e = 0), void 0 === r && (r = t ? t.length : 0), void 0 === n && (n = 0), void 0 === f && (f = this.length), e < 0 || r > t.length || n < 0 || f > this.length) throw new RangeError("out of range index");
    if (n >= f && e >= r) return 0;
    if (n >= f) return -1;
    if (e >= r) return 1;
    if (this === t) return 0;
    let o = (f >>>= 0) - (n >>>= 0),
        i = (r >>>= 0) - (e >>>= 0);
    const u = Math.min(o, i),
        s = this.slice(n, f),
        h = t.slice(e, r);
    for (let t = 0; t < u; ++t)
        if (s[t] !== h[t]) {
            o = s[t], i = h[t];
            break
        }
    return o < i ? -1 : i < o ? 1 : 0
}, OwnBuffer.prototype.includes = function(t, e, r) {
    return -1 !== this.indexOf(t, e, r)
}, OwnBuffer.prototype.indexOf = function(t, e, r) {
    return bidirectionalIndexOf(this, t, e, r, !0)
}, OwnBuffer.prototype.lastIndexOf = function(t, e, r) {
    return bidirectionalIndexOf(this, t, e, r, !1)
}, OwnBuffer.prototype.write = function(t, e, r, n) {
    if (void 0 === e) n = "utf8", r = this.length, e = 0;
    else if (void 0 === r && "string" == typeof e) n = e, r = this.length, e = 0;
    else {
        if (!isFinite(e)) throw new Error("OwnBuffer.write(string, encoding, offset[, length]) is no longer supported");
        e >>>= 0, isFinite(r) ? (r >>>= 0, void 0 === n && (n = "utf8")) : (n = r, r = void 0)
    }
    const f = this.length - e;
    if ((void 0 === r || r > f) && (r = f), t.length > 0 && (r < 0 || e < 0) || e > this.length) throw new RangeError("Attempt to write outside buffer bounds");
    n || (n = "utf8");
    let o = !1;
    for (;;) switch (n) {
        case "hex":
            return hexWrite(this, t, e, r);
        case "utf8":
        case "utf-8":
            return utf8Write(this, t, e, r);
        case "ascii":
        case "latin1":
        case "binary":
            return asciiWrite(this, t, e, r);
        case "base64":
            return base64Write(this, t, e, r);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
            return ucs2Write(this, t, e, r);
        default:
            if (o) throw new TypeError("Unknown encoding: " + n);
            n = ("" + n).toLowerCase(), o = !0
    }
}, OwnBuffer.prototype.toJSON = function() {
    return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
    }
};
const MAX_ARGUMENTS_LENGTH = 4096;

function decodeCodePointsArray(t) {
    const e = t.length;
    if (e <= 4096) return String.fromCharCode.apply(String, t);
    let r = "",
        n = 0;
    for (; n < e;) r += String.fromCharCode.apply(String, t.slice(n, n += 4096));
    return r
}

function asciiSlice(t, e, r) {
    let n = "";
    r = Math.min(t.length, r);
    for (let f = e; f < r; ++f) n += String.fromCharCode(127 & t[f]);
    return n
}

function latin1Slice(t, e, r) {
    let n = "";
    r = Math.min(t.length, r);
    for (let f = e; f < r; ++f) n += String.fromCharCode(t[f]);
    return n
}

function hexSlice(t, e, r) {
    const n = t.length;
    (!e || e < 0) && (e = 0), (!r || r < 0 || r > n) && (r = n);
    let f = "";
    for (let n = e; n < r; ++n) f += hexSliceLookupTable[t[n]];
    return f
}

function utf16leSlice(t, e, r) {
    const n = t.slice(e, r);
    let f = "";
    for (let t = 0; t < n.length - 1; t += 2) f += String.fromCharCode(n[t] + 256 * n[t + 1]);
    return f
}

function checkOffset(t, e, r) {
    if (t % 1 != 0 || t < 0) throw new RangeError("offset is not uint");
    if (t + e > r) throw new RangeError("Trying to access beyond buffer length")
}

function checkInt(t, e, r, n, f, o) {
    if (!OwnBuffer.isBuffer(t)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (e > f || e < o) throw new RangeError('"value" argument is out of bounds');
    if (r + n > t.length) throw new RangeError("Index out of range")
}

function wrtBigUInt64LE(t, e, r, n, f) {
    checkIntBI(e, n, f, t, r, 7);
    let o = Number(e & BigInt(4294967295));
    t[r++] = o, o >>= 8, t[r++] = o, o >>= 8, t[r++] = o, o >>= 8, t[r++] = o;
    let i = Number(e >> BigInt(32) & BigInt(4294967295));
    return t[r++] = i, i >>= 8, t[r++] = i, i >>= 8, t[r++] = i, i >>= 8, t[r++] = i, r
}

function wrtBigUInt64BE(t, e, r, n, f) {
    checkIntBI(e, n, f, t, r, 7);
    let o = Number(e & BigInt(4294967295));
    t[r + 7] = o, o >>= 8, t[r + 6] = o, o >>= 8, t[r + 5] = o, o >>= 8, t[r + 4] = o;
    let i = Number(e >> BigInt(32) & BigInt(4294967295));
    return t[r + 3] = i, i >>= 8, t[r + 2] = i, i >>= 8, t[r + 1] = i, i >>= 8, t[r] = i, r + 8
}

function checkIEEE754(t, e, r, n, f, o) {
    if (r + n > t.length) throw new RangeError("Index out of range");
    if (r < 0) throw new RangeError("Index out of range")
}

function writeFloat(t, e, r, n, f) {
    return e = +e, r >>>= 0, f || checkIEEE754(t, e, r, 4, 34028234663852886e22, -34028234663852886e22), ieee754Write(t, e, r, n, 23, 4), r + 4
}

function writeDouble(t, e, r, n, f) {
    return e = +e, r >>>= 0, f || checkIEEE754(t, e, r, 8, 17976931348623157e292, -17976931348623157e292), ieee754Write(t, e, r, n, 52, 8), r + 8
}
OwnBuffer.prototype.slice = function(t, e) {
    const r = this.length;
    (t = ~~t) < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r), (e = void 0 === e ? r : ~~e) < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r), e < t && (e = t);
    const n = this.subarray(t, e);
    return Object.setPrototypeOf(n, OwnBuffer.prototype), n
}, OwnBuffer.prototype.readUintLE = OwnBuffer.prototype.readUIntLE = function(t, e, r) {
    t >>>= 0, e >>>= 0, r || checkOffset(t, e, this.length);
    let n = this[t],
        f = 1,
        o = 0;
    for (; ++o < e && (f *= 256);) n += this[t + o] * f;
    return n
}, OwnBuffer.prototype.readUintBE = OwnBuffer.prototype.readUIntBE = function(t, e, r) {
    t >>>= 0, e >>>= 0, r || checkOffset(t, e, this.length);
    let n = this[t + --e],
        f = 1;
    for (; e > 0 && (f *= 256);) n += this[t + --e] * f;
    return n
}, OwnBuffer.prototype.readUint8 = OwnBuffer.prototype.readUInt8 = function(t, e) {
    return t >>>= 0, e || checkOffset(t, 1, this.length), this[t]
}, OwnBuffer.prototype.readUint16LE = OwnBuffer.prototype.readUInt16LE = function(t, e) {
    return t >>>= 0, e || checkOffset(t, 2, this.length), this[t] | this[t + 1] << 8
}, OwnBuffer.prototype.readUint16BE = OwnBuffer.prototype.readUInt16BE = function(t, e) {
    return t >>>= 0, e || checkOffset(t, 2, this.length), this[t] << 8 | this[t + 1]
}, OwnBuffer.prototype.readUint32LE = OwnBuffer.prototype.readUInt32LE = function(t, e) {
    return t >>>= 0, e || checkOffset(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3]
}, OwnBuffer.prototype.readUint32BE = OwnBuffer.prototype.readUInt32BE = function(t, e) {
    return t >>>= 0, e || checkOffset(t, 4, this.length), 16777216 * this[t] + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3])
}, OwnBuffer.prototype.readBigUInt64LE = defineBigIntMethod((function(t) {
    validateNumber(t >>>= 0, "offset");
    const e = this[t],
        r = this[t + 7];
    void 0 !== e && void 0 !== r || boundsError(t, this.length - 8);
    const n = e + 256 * this[++t] + 65536 * this[++t] + this[++t] * 2 ** 24,
        f = this[++t] + 256 * this[++t] + 65536 * this[++t] + r * 2 ** 24;
    return BigInt(n) + (BigInt(f) << BigInt(32))
})), OwnBuffer.prototype.readBigUInt64BE = defineBigIntMethod((function(t) {
    validateNumber(t >>>= 0, "offset");
    const e = this[t],
        r = this[t + 7];
    void 0 !== e && void 0 !== r || boundsError(t, this.length - 8);
    const n = e * 2 ** 24 + 65536 * this[++t] + 256 * this[++t] + this[++t],
        f = this[++t] * 2 ** 24 + 65536 * this[++t] + 256 * this[++t] + r;
    return (BigInt(n) << BigInt(32)) + BigInt(f)
})), OwnBuffer.prototype.readIntLE = function(t, e, r) {
    t >>>= 0, e >>>= 0, r || checkOffset(t, e, this.length);
    let n = this[t],
        f = 1,
        o = 0;
    for (; ++o < e && (f *= 256);) n += this[t + o] * f;
    return f *= 128, n >= f && (n -= Math.pow(2, 8 * e)), n
}, OwnBuffer.prototype.readIntBE = function(t, e, r) {
    t >>>= 0, e >>>= 0, r || checkOffset(t, e, this.length);
    let n = e,
        f = 1,
        o = this[t + --n];
    for (; n > 0 && (f *= 256);) o += this[t + --n] * f;
    return f *= 128, o >= f && (o -= Math.pow(2, 8 * e)), o
}, OwnBuffer.prototype.readInt8 = function(t, e) {
    return t >>>= 0, e || checkOffset(t, 1, this.length), 128 & this[t] ? -1 * (255 - this[t] + 1) : this[t]
}, OwnBuffer.prototype.readInt16LE = function(t, e) {
    t >>>= 0, e || checkOffset(t, 2, this.length);
    const r = this[t] | this[t + 1] << 8;
    return 32768 & r ? 4294901760 | r : r
}, OwnBuffer.prototype.readInt16BE = function(t, e) {
    t >>>= 0, e || checkOffset(t, 2, this.length);
    const r = this[t + 1] | this[t] << 8;
    return 32768 & r ? 4294901760 | r : r
}, OwnBuffer.prototype.readInt32LE = function(t, e) {
    return t >>>= 0, e || checkOffset(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24
}, OwnBuffer.prototype.readInt32BE = function(t, e) {
    return t >>>= 0, e || checkOffset(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]
}, OwnBuffer.prototype.readBigInt64LE = defineBigIntMethod((function(t) {
    validateNumber(t >>>= 0, "offset");
    const e = this[t],
        r = this[t + 7];
    void 0 !== e && void 0 !== r || boundsError(t, this.length - 8);
    const n = this[t + 4] + 256 * this[t + 5] + 65536 * this[t + 6] + (r << 24);
    return (BigInt(n) << BigInt(32)) + BigInt(e + 256 * this[++t] + 65536 * this[++t] + this[++t] * 2 ** 24)
})), OwnBuffer.prototype.readBigInt64BE = defineBigIntMethod((function(t) {
    validateNumber(t >>>= 0, "offset");
    const e = this[t],
        r = this[t + 7];
    void 0 !== e && void 0 !== r || boundsError(t, this.length - 8);
    const n = (e << 24) + 65536 * this[++t] + 256 * this[++t] + this[++t];
    return (BigInt(n) << BigInt(32)) + BigInt(this[++t] * 2 ** 24 + 65536 * this[++t] + 256 * this[++t] + r)
})), OwnBuffer.prototype.readFloatLE = function(t, e) {
    return t >>>= 0, e || checkOffset(t, 4, this.length), ieee754Read(this, t, !0, 23, 4)
}, OwnBuffer.prototype.readFloatBE = function(t, e) {
    return t >>>= 0, e || checkOffset(t, 4, this.length), ieee754Read(this, t, !1, 23, 4)
}, OwnBuffer.prototype.readDoubleLE = function(t, e) {
    return t >>>= 0, e || checkOffset(t, 8, this.length), ieee754Read(this, t, !0, 52, 8)
}, OwnBuffer.prototype.readDoubleBE = function(t, e) {
    return t >>>= 0, e || checkOffset(t, 8, this.length), ieee754Read(this, t, !1, 52, 8)
}, OwnBuffer.prototype.writeUintLE = OwnBuffer.prototype.writeUIntLE = function(t, e, r, n) {
    t = +t, e >>>= 0, r >>>= 0, n || checkInt(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
    let f = 1,
        o = 0;
    for (this[e] = 255 & t; ++o < r && (f *= 256);) this[e + o] = t / f & 255;
    return e + r
}, OwnBuffer.prototype.writeUintBE = OwnBuffer.prototype.writeUIntBE = function(t, e, r, n) {
    t = +t, e >>>= 0, r >>>= 0, n || checkInt(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
    let f = r - 1,
        o = 1;
    for (this[e + f] = 255 & t; --f >= 0 && (o *= 256);) this[e + f] = t / o & 255;
    return e + r
}, OwnBuffer.prototype.writeUint8 = OwnBuffer.prototype.writeUInt8 = function(t, e, r) {
    return t = +t, e >>>= 0, r || checkInt(this, t, e, 1, 255, 0), this[e] = 255 & t, e + 1
}, OwnBuffer.prototype.writeUint16LE = OwnBuffer.prototype.writeUInt16LE = function(t, e, r) {
    return t = +t, e >>>= 0, r || checkInt(this, t, e, 2, 65535, 0), this[e] = 255 & t, this[e + 1] = t >>> 8, e + 2
}, OwnBuffer.prototype.writeUint16BE = OwnBuffer.prototype.writeUInt16BE = function(t, e, r) {
    return t = +t, e >>>= 0, r || checkInt(this, t, e, 2, 65535, 0), this[e] = t >>> 8, this[e + 1] = 255 & t, e + 2
}, OwnBuffer.prototype.writeUint32LE = OwnBuffer.prototype.writeUInt32LE = function(t, e, r) {
    return t = +t, e >>>= 0, r || checkInt(this, t, e, 4, 4294967295, 0), this[e + 3] = t >>> 24, this[e + 2] = t >>> 16, this[e + 1] = t >>> 8, this[e] = 255 & t, e + 4
}, OwnBuffer.prototype.writeUint32BE = OwnBuffer.prototype.writeUInt32BE = function(t, e, r) {
    return t = +t, e >>>= 0, r || checkInt(this, t, e, 4, 4294967295, 0), this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = 255 & t, e + 4
}, OwnBuffer.prototype.writeBigUInt64LE = defineBigIntMethod((function(t, e = 0) {
    return wrtBigUInt64LE(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"))
})), OwnBuffer.prototype.writeBigUInt64BE = defineBigIntMethod((function(t, e = 0) {
    return wrtBigUInt64BE(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"))
})), OwnBuffer.prototype.writeIntLE = function(t, e, r, n) {
    if (t = +t, e >>>= 0, !n) {
        const n = Math.pow(2, 8 * r - 1);
        checkInt(this, t, e, r, n - 1, -n)
    }
    let f = 0,
        o = 1,
        i = 0;
    for (this[e] = 255 & t; ++f < r && (o *= 256);) t < 0 && 0 === i && 0 !== this[e + f - 1] && (i = 1), this[e + f] = (t / o >> 0) - i & 255;
    return e + r
}, OwnBuffer.prototype.writeIntBE = function(t, e, r, n) {
    if (t = +t, e >>>= 0, !n) {
        const n = Math.pow(2, 8 * r - 1);
        checkInt(this, t, e, r, n - 1, -n)
    }
    let f = r - 1,
        o = 1,
        i = 0;
    for (this[e + f] = 255 & t; --f >= 0 && (o *= 256);) t < 0 && 0 === i && 0 !== this[e + f + 1] && (i = 1), this[e + f] = (t / o >> 0) - i & 255;
    return e + r
}, OwnBuffer.prototype.writeInt8 = function(t, e, r) {
    return t = +t, e >>>= 0, r || checkInt(this, t, e, 1, 127, -128), t < 0 && (t = 255 + t + 1), this[e] = 255 & t, e + 1
}, OwnBuffer.prototype.writeInt16LE = function(t, e, r) {
    return t = +t, e >>>= 0, r || checkInt(this, t, e, 2, 32767, -32768), this[e] = 255 & t, this[e + 1] = t >>> 8, e + 2
}, OwnBuffer.prototype.writeInt16BE = function(t, e, r) {
    return t = +t, e >>>= 0, r || checkInt(this, t, e, 2, 32767, -32768), this[e] = t >>> 8, this[e + 1] = 255 & t, e + 2
}, OwnBuffer.prototype.writeInt32LE = function(t, e, r) {
    return t = +t, e >>>= 0, r || checkInt(this, t, e, 4, 2147483647, -2147483648), this[e] = 255 & t, this[e + 1] = t >>> 8, this[e + 2] = t >>> 16, this[e + 3] = t >>> 24, e + 4
}, OwnBuffer.prototype.writeInt32BE = function(t, e, r) {
    return t = +t, e >>>= 0, r || checkInt(this, t, e, 4, 2147483647, -2147483648), t < 0 && (t = 4294967295 + t + 1), this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = 255 & t, e + 4
}, OwnBuffer.prototype.writeBigInt64LE = defineBigIntMethod((function(t, e = 0) {
    return wrtBigUInt64LE(this, t, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"))
})), OwnBuffer.prototype.writeBigInt64BE = defineBigIntMethod((function(t, e = 0) {
    return wrtBigUInt64BE(this, t, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"))
})), OwnBuffer.prototype.writeFloatLE = function(t, e, r) {
    return writeFloat(this, t, e, !0, r)
}, OwnBuffer.prototype.writeFloatBE = function(t, e, r) {
    return writeFloat(this, t, e, !1, r)
}, OwnBuffer.prototype.writeDoubleLE = function(t, e, r) {
    return writeDouble(this, t, e, !0, r)
}, OwnBuffer.prototype.writeDoubleBE = function(t, e, r) {
    return writeDouble(this, t, e, !1, r)
}, OwnBuffer.prototype.copy = function(t, e, r, n) {
    if (!OwnBuffer.isBuffer(t)) throw new TypeError("argument should be a Buffer");
    if (r || (r = 0), n || 0 === n || (n = this.length), e >= t.length && (e = t.length), e || (e = 0), n > 0 && n < r && (n = r), n === r) return 0;
    if (0 === t.length || 0 === this.length) return 0;
    if (e < 0) throw new RangeError("targetStart out of bounds");
    if (r < 0 || r >= this.length) throw new RangeError("Index out of range");
    if (n < 0) throw new RangeError("sourceEnd out of bounds");
    n > this.length && (n = this.length), t.length - e < n - r && (n = t.length - e + r);
    const f = n - r;
    return this === t && "function" == typeof Uint8Array.prototype.copyWithin ? this.copyWithin(e, r, n) : Uint8Array.prototype.set.call(t, this.subarray(r, n), e), f
}, OwnBuffer.prototype.fill = function(t, e, r, n) {
    if ("string" == typeof t) {
        if ("string" == typeof e ? (n = e, e = 0, r = this.length) : "string" == typeof r && (n = r, r = this.length), void 0 !== n && "string" != typeof n) throw new TypeError("encoding must be a string");
        if ("string" == typeof n && !OwnBuffer.isEncoding(n)) throw new TypeError("Unknown encoding: " + n);
        if (1 === t.length) {
            const e = t.charCodeAt(0);
            ("utf8" === n && e < 128 || "latin1" === n) && (t = e)
        }
    } else "number" == typeof t ? t &= 255 : "boolean" == typeof t && (t = Number(t));
    if (e < 0 || this.length < e || this.length < r) throw new RangeError("Out of range index");
    if (r <= e) return this;
    let f;
    if (e >>>= 0, r = void 0 === r ? this.length : r >>> 0, t || (t = 0), "number" == typeof t)
        for (f = e; f < r; ++f) this[f] = t;
    else {
        const o = OwnBuffer.isBuffer(t) ? t : OwnBuffer.from(t, n),
            i = o.length;
        if (0 === i) throw new TypeError('The value "' + t + '" is invalid for argument "value"');
        for (f = 0; f < r - e; ++f) this[f + e] = o[f % i]
    }
    return this
};
const errors = {};

function E(t, e, r) {
    errors[t] = class extends r {
        constructor() {
            super(), Object.defineProperty(this, "message", {
                value: e.apply(this, arguments),
                writable: !0,
                configurable: !0
            }), this.name = `${this.name} [${t}]`, this.stack, delete this.name
        }
        get code() {
            return t
        }
        set code(t) {
            Object.defineProperty(this, "code", {
                configurable: !0,
                enumerable: !0,
                value: t,
                writable: !0
            })
        }
        toString() {
            return `${this.name} [${t}]: ${this.message}`
        }
    }
}

function addNumericalSeparator(t) {
    let e = "",
        r = t.length;
    const n = "-" === t[0] ? 1 : 0;
    for (; r >= n + 4; r -= 3) e = `_${t.slice(r-3,r)}${e}`;
    return `${t.slice(0,r)}${e}`
}

function checkBounds(t, e, r) {
    validateNumber(e, "offset"), void 0 !== t[e] && void 0 !== t[e + r] || boundsError(e, t.length - (r + 1))
}

function checkIntBI(t, e, r, n, f, o) {
    if (t > r || t < e) {
        const n = "bigint" == typeof e ? "n" : "";
        let f;
        throw f = o > 3 ? 0 === e || e === BigInt(0) ? `>= 0${n} and < 2${n} ** ${8*(o+1)}${n}` : `>= -(2${n} ** ${8*(o+1)-1}${n}) and < 2 ** ${8*(o+1)-1}${n}` : `>= ${e}${n} and <= ${r}${n}`, new errors.ERR_OUT_OF_RANGE("value", f, t)
    }
    checkBounds(n, f, o)
}

function validateNumber(t, e) {
    if ("number" != typeof t) throw new errors.ERR_INVALID_ARG_TYPE(e, "number", t)
}

function boundsError(t, e, r) {
    if (Math.floor(t) !== t) throw validateNumber(t, r), new errors.ERR_OUT_OF_RANGE(r || "offset", "an integer", t);
    if (e < 0) throw new errors.ERR_BUFFER_OUT_OF_BOUNDS;
    throw new errors.ERR_OUT_OF_RANGE(r || "offset", `>= ${r?1:0} and <= ${e}`, t)
}
E("ERR_BUFFER_OUT_OF_BOUNDS", (function(t) {
    return t ? `${t} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds"
}), RangeError), E("ERR_INVALID_ARG_TYPE", (function(t, e) {
    return `The "${t}" argument must be of type number. Received type ${typeof e}`
}), TypeError), E("ERR_OUT_OF_RANGE", (function(t, e, r) {
    let n = `The value of "${t}" is out of range.`,
        f = r;
    return Number.isInteger(r) && Math.abs(r) > 2 ** 32 ? f = addNumericalSeparator(String(r)) : "bigint" == typeof r && (f = String(r), (r > BigInt(2) ** BigInt(32) || r < -(BigInt(2) ** BigInt(32))) && (f = addNumericalSeparator(f)), f += "n"), n += ` It must be ${e}. Received ${f}`, n
}), RangeError);
const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;

function base64clean(t) {
    if ((t = (t = t.split("=")[0]).trim().replace(INVALID_BASE64_RE, "")).length < 2) return "";
    for (; t.length % 4 != 0;) t += "=";
    return t
}

function utf8ToBytes(t, e) {
    let r;
    e = e || 1 / 0;
    const n = t.length;
    let f = null;
    const o = [];
    for (let i = 0; i < n; ++i) {
        if (r = t.charCodeAt(i), r > 55295 && r < 57344) {
            if (!f) {
                if (r > 56319) {
                    (e -= 3) > -1 && o.push(239, 191, 189);
                    continue
                }
                if (i + 1 === n) {
                    (e -= 3) > -1 && o.push(239, 191, 189);
                    continue
                }
                f = r;
                continue
            }
            if (r < 56320) {
                (e -= 3) > -1 && o.push(239, 191, 189), f = r;
                continue
            }
            r = 65536 + (f - 55296 << 10 | r - 56320)
        } else f && (e -= 3) > -1 && o.push(239, 191, 189);
        if (f = null, r < 128) {
            if ((e -= 1) < 0) break;
            o.push(r)
        } else if (r < 2048) {
            if ((e -= 2) < 0) break;
            o.push(r >> 6 | 192, 63 & r | 128)
        } else if (r < 65536) {
            if ((e -= 3) < 0) break;
            o.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128)
        } else {
            if (!(r < 1114112)) throw new Error("Invalid code point");
            if ((e -= 4) < 0) break;
            o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128)
        }
    }
    return o
}

function asciiToBytes(t) {
    const e = [];
    for (let r = 0; r < t.length; ++r) e.push(255 & t.charCodeAt(r));
    return e
}

function utf16leToBytes(t, e) {
    let r, n, f;
    const o = [];
    for (let i = 0; i < t.length && !((e -= 2) < 0); ++i) r = t.charCodeAt(i), n = r >> 8, f = r % 256, o.push(f), o.push(n);
    return o
}

function base64ToBytes(t) {
    return toByteArray(base64clean(t))
}

function blitBuffer(t, e, r, n) {
    let f;
    for (f = 0; f < n && !(f + r >= e.length || f >= t.length); ++f) e[f + r] = t[f];
    return f
}

function isInstance(t, e) {
    return t instanceof e || null != t && null != t.constructor && null != t.constructor.name && t.constructor.name === e.name
}

function numberIsNaN(t) {
    return t != t
}
const hexSliceLookupTable = function() {
    const t = "0123456789abcdef",
        e = new Array(256);
    for (let r = 0; r < 16; ++r) {
        const n = 16 * r;
        for (let f = 0; f < 16; ++f) e[n + f] = t[r] + t[f]
    }
    return e
}();

function defineBigIntMethod(t) {
    return "undefined" == typeof BigInt ? BufferBigIntNotDefined : t
}

function BufferBigIntNotDefined() {
    throw new Error("BigInt not supported")
}
window && (window.Buffer = OwnBuffer);