package com.carmen.assistant.data

import android.content.Context

class Prefs(context: Context){
    private val prefs = context.getSharedPreferences("carmen_prefs", Context.MODE_PRIVATE)
    var language: String
        get() = prefs.getString("language", "es") ?: "es"
        set(v){ prefs.edit().putString("language", v).apply() }

    var powerSaving: Boolean
        get() = prefs.getBoolean("power_saving", false)
        set(v){ prefs.edit().putBoolean("power_saving", v).apply() }
}
