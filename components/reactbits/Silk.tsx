"use client";

import { useEffect, useRef } from "react";
import { tokens } from "@/lib/tokens";

/**
 * React Bits "Silk", ported from its three.js / R3F version to raw WebGL so the
 * home page does not ship three.js. The fragment shader is React Bits' pattern
 * with the colour mixed between our two greens instead of a single tint.
 * Renders at reduced resolution, pauses offscreen and when the tab is hidden.
 */

const VERT = `attribute vec2 p;varying vec2 vUv;void main(){vUv=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;
const FRAG = `precision mediump float;varying vec2 vUv;
uniform float uTime;uniform vec3 uA;uniform vec3 uB;uniform vec2 uRes;
const float e=2.71828182845904523536;
float noise(vec2 t){vec2 r=e*sin(e*t);return fract(r.x*r.y*(1.+t.x));}
vec2 rot(vec2 uv,float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c)*uv;}
void main(){
  float rnd=noise(gl_FragCoord.xy);
  vec2 uv=vUv;uv.x*=uRes.x/uRes.y;
  vec2 tex=rot(uv*.9,.35)*.9;
  float t=.35*uTime;
  tex.y+=.03*sin(8.*tex.x-t);
  float pat=.6+.4*sin(5.*(tex.x+tex.y+cos(3.*tex.x+5.*tex.y)+.02*t)+sin(20.*(tex.x+tex.y-.1*t)));
  vec3 col=mix(uA,uB,pat)-rnd/40.;
  gl_FragColor=vec4(col,1.);
}`;

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

export default function Silk({ className, active = true }: { className?: string; active?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const control = useRef<{ play: () => void; pause: () => void } | null>(null);

  useEffect(() => {
    activeRef.current = active;
    if (active) control.current?.play();
    else control.current?.pause();
  }, [active]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "uTime");
    const uRes = gl.getUniformLocation(prog, "uRes");
    gl.uniform3fv(gl.getUniformLocation(prog, "uA"), hex(tokens.secondary));
    gl.uniform3fv(gl.getUniformLocation(prog, "uB"), hex(tokens.primaryRaised));

    const scale = 0.5; // half resolution: it is a soft field, not detail
    const resize = () => {
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let visible = false;
    const start = performance.now();
    const frame = (now: number) => {
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };
    const play = () => {
      if (!raf && visible && activeRef.current && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const pause = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
      else pause();
    });
    io.observe(canvas);
    control.current = { play, pause };
    const onVis = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      pause();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
