{**
 * templates/settings.tpl
 *
 * AITD plugin settings form.
 *}

<script>
    $(function() {
        $('#aitdSettingsForm').pkpHandler('$.pkp.controllers.form.AjaxFormHandler');
    });
</script>

<form id="aitdSettingsForm" class="pkp_form" method="post" action="{url router=$smarty.const.ROUTE_COMPONENT component="plugins.generic.aitd.AitdPlugin" op="manage" verb="settings" plugin="aitdPlugin" category="generic" escape=false}">
    {csrf}

    <div class="pkp_helpers_clear">
        <h3>{translate key="plugins.generic.aitd.settings.title"}</h3>

        <div class="pkp_helpers_clear">
            <div class="field">
                <div class="label">
                    <label for="includeInMenu">{translate key="plugins.generic.aitd.settings.includeInMenu"}</label>
                </div>
                <div class="value">
                    <select name="includeInMenu" id="includeInMenu" class="selectmenu">
                        <option value="1" {if $includeInMenu}selected="selected"{/if}>{translate key="common.yes"}</option>
                        <option value="0" {if !$includeInMenu}selected="selected"{/if}>{translate key="common.no"}</option>
                    </select>
                </div>
                <p class="description">{translate key="plugins.generic.aitd.settings.includeInMenu.description"}</p>
            </div>
        </div>
    </div>

    <div class="pkp_helpers_clear">
        <div class="buttons">
            <button class="pkp_button" type="submit">{translate key="common.save"}</button>
        </div>
    </div>
</form>
