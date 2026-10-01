# ⚽ Proyecto Gestión de Canchas

¡Bienvenidos! Este es el frontend del proyecto integrador desarrollado con **React + Vite + Tailwind CSS**.

📂 Guía de Git para el Equipo **!!IMPORTANTE LEER¡¡**

Para mantener el proyecto sincronizado sin errores, sigan este orden siempre que vayan a trabajar:

1. Antes de empezar a programar (Actualizar)
Siempre bajen los cambios que sus compañeros hayan subido para no trabajar sobre código viejo.

`git pull`: Trae los cambios más recientes del repositorio remoto a tu PC.

2. Al terminar un avance (Guardar y Subir)
Cuando termines una funcionalidad o un componente (por ejemplo, el Navbar.jsx), sigue estos pasos:

Paso A: `git add -A`

(Prepara todos tus archivos nuevos o modificados para el envío).

Paso B: `git commit -m "Descripción breve de lo que hiciste"`

(Le pone una etiqueta a tu avance. Ejemplo: "Agregado componente de Login").

Paso C: `git push`

3. Si no está seguro del correcto funcionamiento del codigo **NO SUBIR NADA HASTA CORREGIRLO, ya que no manejamos ramas, un error afecta a todos**

## 🚀 Comandos Rápidos
- **Instalar dependencias:** `npm install`
- **Correr el proyecto:** `npm run dev`
- **Construir para producción:** `npm run build`
- **Detener terminal:** `ctrl + c`
- **Instalar React Router:** `npm install react-router-dom`

## 📂 Estructura del Proyecto
- `src/components`: Componentes pequeños (botones, tarjetas, headers o cualquier cosa que se repita en las demas paginas).
- `src/pages`: Vistas completas (Home, Canchas, Reservar).
- `src/assets/images`: Imágenes y logos de las canchas.

## 🎨 Estilos
Usamos **Tailwind CSS**. No editen el archivo CSS **(NO TOCAR INDEX.CSS)** global a menos que sea estrictamente necesario; prefieran usar las clases directas en el HTML.

## 📌 Notas del Equipo
- Para los iconos, instalaremos `lucide-react` o `react-icons`.
- Las rutas se manejan en `App.jsx`.