import { ExtensionPreferences } from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";
import Adw from "gi://Adw";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk";

const urgencyLevels = ["low", "normal", "high", "critical"];
const iconNames = ["colorful", "white", "black", "grey"];

export default class SlackerPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();
        const page = new Adw.PreferencesPage();
        const group = new Adw.PreferencesGroup();
        page.add(group);

        // Icon Style
        const rowIcon = new Adw.ActionRow({
            title: "Icon Style",
        });
        group.add(rowIcon);

        const dropdownIcon = new Gtk.DropDown({
            valign: Gtk.Align.CENTER,
            model: Gtk.StringList.new(iconNames),
            selected: settings.get_int("icon-name"),
        });

        settings.bind("icon-name", dropdownIcon, "selected", Gio.SettingsBindFlags.DEFAULT);

        rowIcon.add_suffix(dropdownIcon);
        rowIcon.activatable_widget = dropdownIcon;

        // Urgency Level
        const rowUrgency = new Adw.ActionRow({
            title: "Urgency Level",
            subtitle: "Critical notifications auto-expand but do not timeout",
        });
        group.add(rowUrgency);

        const dropdownUrgency = new Gtk.DropDown({
            valign: Gtk.Align.CENTER,
            model: Gtk.StringList.new(urgencyLevels),
            selected: settings.get_int("urgency-level"),
        });

        settings.bind("urgency-level", dropdownUrgency, "selected", Gio.SettingsBindFlags.DEFAULT);

        rowUrgency.add_suffix(dropdownUrgency);
        rowUrgency.activatable_widget = dropdownUrgency;

        // Transient Mode
        const rowTransient = new Adw.ActionRow({
            title: "Transient Mode",
            subtitle: "Do not put notifications in tray",
        });
        group.add(rowTransient);

        const toggleTransient = new Gtk.Switch({
            active: settings.get_boolean("transient-mode"),
            valign: Gtk.Align.CENTER,
        });

        settings.bind("transient-mode", toggleTransient, "active", Gio.SettingsBindFlags.DEFAULT);

        rowTransient.add_suffix(toggleTransient);
        rowTransient.activatable_widget = toggleTransient;

        window.add(page);
    }
}
