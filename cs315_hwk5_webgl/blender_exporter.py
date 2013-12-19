import os
import math
import json
import bpy
from mathutils import Vector, Matrix, Quaternion

basePath = bpy.path.abspath('//')
exportDir = os.path.join(basePath, '..', 'cs315_hwk5_webgl', 'stormhaven')


def outputFile(name):
    return os.path.join(exportDir, name)


def exportSeperateObj():
    bpy.ops.object.select_all(action='DESELECT')
    
    scene = bpy.context.scene
    
    for ob in scene.objects:
        scene.objects.active = ob
        ob.select = True
        
        # save world space data
        old_loc = ob.location.copy()
        old_rot = ob.rotation_quaternion.copy()
        old_scale = ob.scale.copy()
        
        # reset to origin
        ob.location = Vector((0, 0, 0))
        ob.rotation_quaternion = Quaternion((0, 0, 0, 1))
        ob.scale = Vector((1, 1, 1))
        
        # do the export
        bpy.ops.export_scene.obj(
            filepath=outputFile("%s.obj" % ob.name),
            use_mesh_modifiers=True,
            use_normals=True,
            use_triangles=True,
            use_selection=True)
        
        # restore world space data
        ob.location = old_loc
        ob.rotation_quaternion = old_rot
        ob.scale = old_scale
        
        #asdf
        
        ob.select = False
    

def exportSceneFile():
    fp = open(outputFile("alienPlanetScene.json"), 'w')
    
    cam = bpy.context.scene.camera
    
    SCENE = {
        'camera': {
            'position': [cam.location.x, cam.location.y, cam.location.z],
            'nearclip': cam.data.clip_start,
            'farclip': cam.data.clip_end,
        },
        'objects': [],
    }
    
    for ob in bpy.context.scene.objects:
        SCENE['objects'].append({
            'name': ob.name,
            'position': [ob.location.x, ob.location.y, ob.location.z],
            'rotation': [ob.rotation_euler.x, ob.rotation_euler.y, ob.rotation_euler.z],
            'scale': [ob.scale.x, ob.scale.y, ob.scale.z],
        })
    
    fp.write(json.dumps(SCENE, indent=4))
    fp.close()


exportSeperateObj()
exportSceneFile()