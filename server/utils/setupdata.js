import {RoleModel, PermissionModel, UserModel} from "../models"
import {
    MANAGE_PERMISSIONS,
    MANAGE_ROLES,
    EDIT_PROFILE,
    CREATE_USER,
    LIST_USERS,
    EDIT_USER,
    DELETE_USER,
    EDIT_ROLE_PERMISSIONS
} from "../../client/clientconstants"

import {
    ROLE_SUPER_ADMIN,
    ROLE_ADMIN,
    ROLE_APP_USER
} from "../serverconstants"

export const setupSnippetData = async (config) => {
    console.log("************ ADDING SNIPPET DATA ************")
    //console.log("received config ", config)
    await addPermissions()
    await addRoles()
    await addAdminUsers(config)

}

const addPermissions = async () => {

    console.log("SETTING UP PERMISSIONS ...")

    if (!await PermissionModel.exists(MANAGE_PERMISSIONS)) {
        await PermissionModel.savePermission({
            name: MANAGE_PERMISSIONS
        })
    }

    if (!await PermissionModel.exists(MANAGE_ROLES)) {
        await PermissionModel.savePermission({
            name: MANAGE_ROLES
        })
    }

    if (!await PermissionModel.exists(LIST_USERS)) {
        await PermissionModel.savePermission({
            name: LIST_USERS
        })
    }

    if (!await PermissionModel.exists(EDIT_PROFILE)) {
        await PermissionModel.savePermission({
            name: EDIT_PROFILE
        })
    }

    if (!await PermissionModel.exists(EDIT_ROLE_PERMISSIONS)) {
        await PermissionModel.savePermission({
            name: EDIT_ROLE_PERMISSIONS
        })
    }

    if (!await PermissionModel.exists(CREATE_USER)) {
        await PermissionModel.savePermission({
            name: CREATE_USER
        })
    }

    if (!await PermissionModel.exists(EDIT_USER)) {
        await PermissionModel.savePermission({
            name: EDIT_USER
        })
    }

    if (!await PermissionModel.exists(DELETE_USER)) {
        await PermissionModel.savePermission({
            name: DELETE_USER
        })
    }
}

const addRoles = async () => {

    console.log("SETTING UP ROLES ...")

    /**
     * Super admin can manage users/permissions and roles
     */
    if (!await RoleModel.exists(ROLE_SUPER_ADMIN)) {

        let permissions = []
        let managePermissions = await PermissionModel.findOne({name: MANAGE_PERMISSIONS}).lean()
        if (managePermissions) {
            managePermissions.configurable = false
            managePermissions.enabled = true
            permissions.push(managePermissions)
        }
        let manageRoles = await PermissionModel.findOne({name: MANAGE_ROLES}).lean()
        if (manageRoles) {
            manageRoles.configurable = false
            manageRoles.enabled = true
            permissions.push(manageRoles)
        }
        let listUsers = await PermissionModel.findOne({name: LIST_USERS}).lean()
        if (listUsers) {
            listUsers.configurable = false
            listUsers.enabled = true
            permissions.push(listUsers)
        }
        await RoleModel.saveRole({
            name: ROLE_SUPER_ADMIN,
            permissions: permissions
        })
    }

    if (!await RoleModel.exists(ROLE_ADMIN)) {
        let permissions = []
        let listUsers = await PermissionModel.findOne({name: LIST_USERS}).lean()
        if (listUsers) {
            listUsers.configurable = true
            listUsers.enabled = true
            permissions.push(listUsers)
        }

        let editRolePermissions = await PermissionModel.findOne({name: EDIT_ROLE_PERMISSIONS}).lean()
        if (editRolePermissions) {
            editRolePermissions.configurable = true
            editRolePermissions.enabled = true
            permissions.push(editRolePermissions)
        }

        let createUserPermissions = await PermissionModel.findOne({name: CREATE_USER}).lean()
        if (createUserPermissions) {
            createUserPermissions.configurable = true
            createUserPermissions.enabled = true
            permissions.push(createUserPermissions)
        }

        let editUserPermissions = await PermissionModel.findOne({name: EDIT_USER}).lean()
        if (editUserPermissions) {
            editUserPermissions.configurable = true
            editUserPermissions.enabled = true
            permissions.push(editUserPermissions)
        }

        let deleteUserPermissions = await PermissionModel.findOne({name: DELETE_USER}).lean()
        if (deleteUserPermissions) {
            deleteUserPermissions.configurable = true
            deleteUserPermissions.enabled = true
            permissions.push(deleteUserPermissions)
        }
        await RoleModel.saveRole({
            name: ROLE_ADMIN,
            permissions: permissions
        })
    }

    if (!await RoleModel.exists(ROLE_APP_USER)) {
        let permissions = []
        let editProfile = await PermissionModel.findOne({name: EDIT_PROFILE}).lean()
        if (editProfile) {
            editProfile.configurable = true
            editProfile.enabled = true
            permissions.push(editProfile)
        }
        await RoleModel.saveRole({
            name: ROLE_APP_USER,
            permissions: permissions
        })
    }
}


const addAdminUsers = async (conf) => {

    console.log("SETTING UP ADMIN USERS ...")

    if (!await UserModel.exists(conf.adminUser.email)) {
        let adminRole = await RoleModel.findOne({name: ROLE_ADMIN}).lean()

        // create user
        await UserModel.saveUser({
            email: conf.adminUser.email,
            firstName: "App",
            lastName: "Admin",
            roles: [adminRole],
            password: conf.adminUser.password
        })
    }

    if (!await UserModel.exists(conf.superAdminUser.email)) {

        let superAdminRole = await RoleModel.findOne({name: ROLE_SUPER_ADMIN}).lean()
        // create user
        await UserModel.saveUser({
            email: conf.superAdminUser.email,
            firstName: "Super",
            lastName: "Admin",
            roles: [superAdminRole],
            password: conf.superAdminUser.password
        })
    }

    console.log("************ FINISHED ADDING SNIPPET DATA ************")
}