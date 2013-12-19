import os
import math
import json
import bpy
from mathutils import Vector, Matrix, Quaternion

basePath = bpy.path.abspath('//')
exportDir = os.path.join(basePath, '..', 'cs315_hwk5_webgl', 'stormhaven')

compileDir = os.path.join(basePath, '..', 'cs315_hwk5_webgl')
compileCmd = "stormhaven_compiler.cmd"

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
        old_rot = ob.rotation_euler.to_quaternion().copy()
        old_scale = ob.scale.copy()
        
        # reset to origin
        bpy.ops.object.location_clear()
        bpy.ops.object.rotation_clear()
        bpy.ops.object.scale_clear()
        #ob.location = Vector((0, 0, 0))
        #ob.rotation_quaternion = Quaternion((0, 0, 0, 1))
        #ob.rotation_quaternion = Quaternion((1, 0, 0, 0))
        #ob.scale = Vector((1, 1, 1))
        
        # do the export
        bpy.ops.export_scene.obj(
            filepath=outputFile("%s.obj" % ob.name),
            use_mesh_modifiers=True,
            use_normals=True,
            use_triangles=True,
            use_selection=True)
        
        # restore world space data
        ob.location = old_loc
        ob.rotation_euler = old_rot.to_euler()
        ob.scale = old_scale
        
        #asdf
        
        ob.select = False
    

def getDiffuseColor(mat):
    return [
        mat.diffuse_color.r * mat.diffuse_intensity,
        mat.diffuse_color.g * mat.diffuse_intensity,
        mat.diffuse_color.b * mat.diffuse_intensity,
    ]


def getSpecularColor(mat):
    return [
        mat.specular_color.r * mat.specular_intensity,
        mat.specular_color.g * mat.specular_intensity,
        mat.specular_color.b * mat.specular_intensity,
    ]


def exportSceneFile():
    fp = open(outputFile("alienPlanetScene.json"), 'w')
    
    cam = bpy.context.scene.camera
    camQuat = cam.matrix_world.to_quaternion()
    
    SCENE = {
        'camera': {
            'position': [cam.location.x, cam.location.y, cam.location.z],
            'orientation': [camQuat.x, camQuat.y, camQuat.z, camQuat.w],
            'nearclip': cam.data.clip_start,
            'farclip': cam.data.clip_end,
        },
        'objects': [],
    }
    
    for ob in bpy.context.scene.objects:
        rot = ob.rotation_euler.to_quaternion().copy()
        entry = {
            'name': ob.name,
            # pos and orientation:
            'position': [ob.location.x, ob.location.y, ob.location.z],
            'rotation': [ob.rotation_euler.x, ob.rotation_euler.y, ob.rotation_euler.z],
            'orientation': [rot.x, rot.y, rot.z, rot.w],
            'scale': [ob.scale.x, ob.scale.y, ob.scale.z],
            # default material:
            'material': "None",
            'ambient': [0.01, 0.01, 0.01],
            'diffuse': [0.8, 0.8, 0.8],
            'specular': [0.8, 0.8, 0.8],
            'shininess': 50,
        }
        if len(ob.material_slots) > 0:
            mat = ob.material_slots[0].material
            entry['material'] = mat.name
            entry['ambient'] = [0.05, 0.05, 0.05]
            entry['diffuse'] = getDiffuseColor(mat)
            entry['specular'] = getSpecularColor(mat)
            entry['shininess'] = mat.specular_hardness
            
            # add emit values to ambient
            entry['ambient'][0] += (mat.diffuse_color.r * mat.emit)
            entry['ambient'][1] += (mat.diffuse_color.g * mat.emit)
            entry['ambient'][2] += (mat.diffuse_color.b * mat.emit)
            
        SCENE['objects'].append(entry)
    
    fp.write(json.dumps(SCENE, indent=4))
    fp.close()


# export everything
exportSeperateObj()
exportSceneFile()

# automatically run the data compiler
os.chdir(compileDir)
os.system(compileCmd)
