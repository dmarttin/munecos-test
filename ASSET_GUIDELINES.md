# Asset Guidelines for Roomies MVP

This document outlines best practices and technical requirements for creating and optimizing 3D assets and textures for the Roomies webapp.

## Performance Budget

### Target Performance
- **Primary Target**: iPad (Safari) at 50-60 FPS
- **Acceptable**: 30+ FPS on older iPad models
- **Test Devices**: iPad Air (2020+), iPad Pro

### Per-Asset Limits (MVP Phase)
- **Polygon Count**: 20,000 - 60,000 triangles max per model
- **Texture Resolution**: 1K (1024x1024) to 2K (2048x2048) max
- **File Size**: 
  - Textures: < 500KB per texture (compressed)
  - Models: < 1MB per .glb file

## Current Implementation (Phase 1-2)

### Sprite-Based Characters
Currently using 2D sprite images as billboards in 3D space.

**Image Specifications:**
- Format: PNG with transparency
- Resolution: 512x512 to 1024x1024 pixels
- File size: < 200KB per sprite
- Transparent background required
- Character should be centered in frame

**Naming Convention:**
```
character_01.png
character_02.png
...
```

## Future: 3D Models (Phase 3+)

### Model Format
- **Primary Format**: glTF 2.0 (.glb binary format)
- **Why glTF**: Industry standard, efficient, supports PBR materials

### Export Settings (Blender)

#### Basic Export
1. File → Export → glTF 2.0 (.glb)
2. Settings:
   - Format: glTF Binary (.glb)
   - Include: Selected Objects
   - Transform: +Y Up
   - Geometry:
     - ✅ Apply Modifiers
     - ✅ UVs
     - ✅ Normals
     - ✅ Vertex Colors (if used)
   - Material: Export
   - Animation: Include if available

#### Optimization Checklist
- [ ] Remove unnecessary vertices/edges
- [ ] Merge duplicate vertices
- [ ] Remove internal faces
- [ ] Apply scale/rotation/location before export
- [ ] Use power-of-2 texture dimensions (512, 1024, 2048)
- [ ] Bake complex materials to textures when possible
- [ ] Limit bone count for rigged models (< 50 bones)

### Texture Guidelines

#### Texture Maps
- **Albedo/Base Color**: RGB, no lighting information
- **Normal Map**: Optional, for surface detail
- **Roughness/Metallic**: Combined in single texture if possible
- **Emission**: For glowing elements (use sparingly)

#### Texture Optimization
```bash
# Resize large textures
# Example using ImageMagick
convert input.png -resize 1024x1024 output.png

# Compress PNG
pngquant --quality 80-95 input.png -o output.png
```

#### Future: Advanced Compression
For production, consider:
- **KTX2 with Basis Universal**: 50-75% smaller than PNG
- **Draco compression**: Reduces geometry size by 90%+

## Asset Pipeline Workflow

### Current (Sprites)
1. Create character art (Illustrator, Photoshop, etc.)
2. Export as PNG with transparency
3. Optimize with pngquant or similar
4. Place in `/public/roomies/`
5. Add entry to `/public/catalog.json`

### Future (3D Models)
1. Model in Blender (or preferred 3D software)
2. Optimize geometry (see checklist above)
3. Create/bake textures
4. Export as .glb
5. Optimize with gltf-transform:
   ```bash
   # Install gltf-transform
   npm install -g @gltf-transform/cli
   
   # Optimize model
   gltf-transform optimize input.glb output.glb
   
   # Optional: Add Draco compression
   gltf-transform draco input.glb output.glb
   ```
6. Place in `/public/models/`
7. Update catalog.json with modelUrl

## Catalog Structure

### catalog.json Format
```json
{
  "version": "1.0",
  "roomies": [
    {
      "id": "roomie-01",
      "name": "Character Name",
      "description": "Brief description",
      "spriteUrl": "/roomies/character_01.png",
      "modelUrl": "/models/character_01.glb",  // Future
      "scale": 1.0,
      "tags": ["category1", "category2"]
    }
  ]
}
```

### Field Descriptions
- **id**: Unique identifier (kebab-case)
- **name**: Display name
- **description**: Short description for UI tooltip
- **spriteUrl**: Path to 2D sprite (current)
- **modelUrl**: Path to 3D model (future, optional)
- **scale**: Scale multiplier (1.0 = default size)
- **tags**: Categories for filtering/organization

## Testing & Validation

### Performance Testing
```javascript
// In browser console
// Monitor FPS
const stats = new Stats();
document.body.appendChild(stats.dom);

// Check draw calls and triangles
console.log(renderer.info);
```

### Asset Validation Checklist
- [ ] File loads without errors
- [ ] Texture displays correctly
- [ ] Transparency works as expected
- [ ] File size within budget
- [ ] FPS remains above 30 with 10+ instances
- [ ] No console errors or warnings

## Common Issues & Solutions

### Issue: Texture appears black
**Solution**: Check that texture has proper UV mapping and isn't using unsupported features

### Issue: Model appears too large/small
**Solution**: Adjust scale in catalog.json or apply scale in Blender before export

### Issue: Transparent areas show as white/black
**Solution**: Ensure PNG has alpha channel and alphaTest is set in material

### Issue: Performance drops with multiple characters
**Solution**: 
- Reduce polygon count
- Lower texture resolution
- Use texture atlasing for multiple characters
- Implement LOD (Level of Detail) system

## Advanced Optimization (Future)

### Texture Atlasing
Combine multiple character textures into single atlas to reduce draw calls:
```
[Char1] [Char2]
[Char3] [Char4]
```

### Level of Detail (LOD)
Create multiple versions of models:
- LOD0: Full detail (< 5 units from camera)
- LOD1: Medium detail (5-15 units)
- LOD2: Low detail (15+ units)

### Instancing
For multiple copies of same character, use THREE.InstancedMesh

## Resources

### Tools
- **Blender**: Free 3D modeling software
- **gltf-transform**: CLI tool for glTF optimization
- **glTF Viewer**: https://gltf-viewer.donmccurdy.com/
- **ImageMagick**: Image processing
- **pngquant**: PNG compression

### References
- glTF 2.0 Spec: https://www.khronos.org/gltf/
- Three.js Docs: https://threejs.org/docs/
- Basis Universal: https://github.com/BinomialLLC/basis_universal

## Version History
- v1.0 (2026-01-07): Initial guidelines for Phase 2
