{**
 * templates/page.tpl
 *
 * AITD Generator page template.
 *}
 
{include file="frontend/components/header.tpl" pageTitle="plugins.generic.aitd.pageTitle"}

<div class="container aitd-container">
    <div class="row">
        <div class="col-md-12">
            <h1 class="page-header">{translate key="plugins.generic.aitd.pageTitle"}</h1>
            <p class="lead">{translate key="plugins.generic.aitd.pageDescription"}</p>
        </div>
    </div>

    {* Include the AITD generator HTML *}
    <div id="aitd-generator">
        {* The generator will be rendered by JavaScript *}
        <div id="aitd-app">
            <div class="aitd-loading">
                <i class="fa fa-spinner fa-spin"></i> {translate key="plugins.generic.aitd.loading"}
            </div>
        </div>
    </div>
</div>

{include file="frontend/components/footer.tpl"}

{* Load CSS and JS *}
{load_css src="`$pluginUrl`/css/aitd.css"}
{load_js src="`$pluginUrl`/js/aitd.js"}

<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize the AITD generator
        if (typeof AITDGenerator !== 'undefined') {
            AITDGenerator.init('aitd-app');
        }
    });
</script>
