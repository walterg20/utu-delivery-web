# DESIGN.md — Regional Food, Delivery & Fintech System (Uturunco Studio)

Documento maestro de especificación de diseño de interfaz (UI), tokens de diseño, sistema tipográfico, paleta de colores y patrones de componentes. Optimizado para consumo de modelos de inteligencia artificial (LLMs), desarrolladores frontend (Next.js / Flutter) y sistemas de diseño asistido.

---

## 1. Identidad de Marca y Filosofía Visual

- **Marca:** Uturunco Studio / Plataforma Regional de Delivery & Billetera Virtual (Resistencia - Corrientes).
- **Arquetipo y Estilo:** Fintech moderna + Logística reactiva de alta velocidad. Combina solidez institucional (Azul Índigo / Navy) con vitalidad operativa y crecimiento económico sustentable (Verde Esmeralda).
- **Principios de Diseño:**
  - **Claridad Transaccional:** Jerarquía estricta en montos, comisiones reducidas (6% vs 25%-35%), PIN de seguridad de 4 dígitos y estados de pedidos.
  - **Inmediatez Operativa:** Componentes de alto contraste táctil para pantallas en movimiento (repartidores en moto) y entornos de cocina ruidosos con grasa/calor (KDS).
  - **Confiabilidad Normativa:** Estética que refleja cumplimiento riguroso con la Ley Provincial N° 2608-L y regulaciones municipales de Resistencia y Corrientes.

---

## 2. Paleta de Colores Oficial (Brand & Theme Tokens)

### 2.1. Colores Principales (Core Brand Colors)
```yaml
brand:
  primary:
    hex: "#1E2671"
    name: "Uturunco Navy / Azul Índigo"
    role: "Color primario corporativo. Barras de navegación, encabezados principales, botones primarios de confirmación, tarjetas destacadas e identidad de marca."
  accent:
    hex: "#128842"
    name: "Uturunco Green / Verde Esmeralda"
    role: "Color secundario y de acento positivo. Éxito, dinero/saldo acreditado, cashback, botón de aceptación de pedidos, badges de conexión en vivo y estados activos."
```

### 2.2. Superficies y Fondos (Surface & Background Tokens)
```yaml
surface:
  background-light: "#F8FAFC"
  surface-card: "#FFFFFF"
  surface-card-alt: "#F1F5F9"
  surface-dark-header: "#0F143A"
  surface-dark-card: "#161B46"
  border-subtle: "#E2E8F0"
  border-brand: "#1E2671"
```

### 2.3. Jerarquía Tipográfica de Color (Text Tokens)
```yaml
text:
  primary: "#0F172A"
  secondary: "#475569"
  muted: "#94A3B8"
  inverse: "#FFFFFF"
  on-accent: "#FFFFFF"
```

### 2.4. Colores Semánticos y de Estados (Functional Tokens)
```yaml
state:
  success:
    hex: "#128842"
    background: "#ECFDF5"
    text: "#065F46"
  warning:
    hex: "#F59E0B"
    background: "#FFFBEB"
    text: "#92400E"
  danger:
    hex: "#EF4444"
    background: "#FEF2F2"
    text: "#991B1B"
  info:
    hex: "#3B82F6"
    background: "#EFF6FF"
    text: "#1E40AF"
```

---

## 3. Tipografía

- **Familia Primaria:** `Plus Jakarta Sans`, `Inter`, o `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.
- **Familia Numérica / Código / Badges:** `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`.

### Escala Tipográfica:
- **Display / Hero:** `32px` - `36px` | `font-bold` (`700` o `800`) | `tracking-tight`
- **Heading 1:** `24px` - `28px` | `font-bold` (`700`)
- **Heading 2:** `20px` - `22px` | `font-semibold` (`600`)
- **Heading 3:** `16px` - `18px` | `font-semibold` (`600`)
- **Body Regular:** `14px` - `15px` | `font-normal` (`400`) | `leading-relaxed`
- **Body Small / Captions:** `12px` - `13px` | `font-medium` (`500`)
- **Badges / Monospace Tags:** `10px` - `11px` | `font-bold` (`700`) | `tracking-wider` | `uppercase`

---

## 4. Bordes, Radios y Sombras

```css
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-full: 9999px;

--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.05);
--shadow-brand: 0 10px 25px -5px rgba(30, 38, 113, 0.25);
--shadow-accent: 0 10px 25px -5px rgba(18, 136, 66, 0.25);
```

---

## 5. Pautas de Implementación Técnica

1. **Uso de Colores:** Emplear siempre `#1E2671` para acciones primarias/institucionales y `#128842` para balances, estados positivos y acciones táctiles de cocina.
2. **Componentes Móviles (Flutter):** Diseñar para ancho base de `390px` a `412px`, botones táctiles con altura mínima de `48px`.
3. **Componentes Web (Next.js):** Diseñar bajo arquitectura modular de componentes, soporte para modo oscuro/claro.
4. **Respeto de Requisitos ERS:** Incorporar siempre: PIN de entrega de 4 dígitos (RF-04), comisión transparente del 6% (RF-14), registro de partida doble (RF-13) y validación de la Ley 2608-L (RF-15).

---

## 6. Componentes

### Buttons & Triggers
- **Primary:** Navy fill (`#1E2671`), white text, height 52px (mobile) / 44px (web).
- **Accent:** Green fill (`#128842`), white text, para acciones positivas (aceptar, confirmar).
- **Ghost/Outlined:** `1.5px` border con hover states sutiles.

### Cards
- Background: `#FFFFFF` (light) / `#161B46` (dark)
- Border: `1px solid #E2E8F0`
- Radius: `16px`
- Shadow: `--shadow-md`

### Inputs
- Min height: `48px`
- Border transition on focus to Primary Navy o Accent Green
- Focus ring: `2px`

### Badges Técnicos Flotantes
```html
<div class="fixed top-3 right-3 z-50 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold tracking-wider uppercase bg-[#0f143a]/90 backdrop-blur-md text-white border border-[#1e2671] shadow-lg">
  <span class="w-2 h-2 rounded-full bg-[#128842] animate-pulse"></span>
  <span>{CÓDIGO_PANTALLA}</span>
</div>
```
