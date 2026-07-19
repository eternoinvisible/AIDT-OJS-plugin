<?php
/**
 * @file plugins/generic/aitdPlugin/AitdPlugin.php
 *
 * Copyright (c) 2026 Sergio Santamarina
 * Distributed under the GNU AGPL v3.0.
 *
 * @ingroup plugins_generic_aitd
 * @brief AITD Generator plugin for OJS.
 */

import('lib.pkp.classes.plugins.GenericPlugin');

class AitdPlugin extends GenericPlugin
{
    /**
     * @copydoc Plugin::register()
     */
    public function register($category, $path, $mainContextId = null)
    {
        $success = parent::register($category, $path, $mainContextId);
        if ($success && $this->getEnabled()) {
            // Register the AITD page
            Hook::add('LoadHandler', [$this, 'handlePageRequest']);
            // Add navigation menu item
            Hook::add('TemplateManager::display', [$this, 'addNavigationMenu']);
        }
        return $success;
    }

    /**
     * Get the display name of the plugin.
     */
    public function getDisplayName()
    {
        return __('plugins.generic.aitd.displayName');
    }

    /**
     * Get the description of the plugin.
     */
    public function getDescription()
    {
        return __('plugins.generic.aitd.description');
    }

    /**
     * Handle page requests for the AITD generator.
     */
    public function handlePageRequest($hookName, $args)
    {
        $page = $args[0];
        $op = $args[1];
        $handler = $args[3];

        if ($page === 'aitd') {
            $handler = new \PKP\handler\PKPHandler();
            $handler->setPlugin($this);
            
            switch ($op) {
                case 'index':
                default:
                    $this->displayAitdPage();
                    break;
            }
            return true;
        }
        return false;
    }

    /**
     * Display the AITD generator page.
     */
    public function displayAitdPage()
    {
        $templateMgr = TemplateManager::getManager(Application::get()->getRequest());
        $templateMgr->assign('pluginUrl', $this->getPluginUrl());
        
        // Pass plugin settings to the template
        $journal = Application::get()->getRequest()->getContext();
        if ($journal) {
            $templateMgr->assign('journalName', $journal->getLocalizedName());
        }
        
        $templateMgr->display($this->getTemplateResource('page.tpl'));
        exit;
    }

    /**
     * Add AITD link to the navigation menu.
     */
    public function addNavigationMenu($hookName, $args)
    {
        $templateMgr = $args[0];
        $request = Application::get()->getRequest();
        $journal = $request->getContext();
        
        if (!$journal) {
            return;
        }

        // Only add if the plugin is enabled
        if (!$this->getEnabled()) {
            return;
        }

        $templateMgr->addJavaScript(
            'aitd-nav',
            $this->getPluginUrl() . '/js/aitd.js',
            ['contexts' => 'frontend']
        );

        // Add to primary navigation menu
        $primaryNav = $templateMgr->getTemplateVars('primaryNav');
        if (!is_array($primaryNav)) {
            $primaryNav = [];
        }

        $aitdNavItem = [
            'url' => $request->getDispatcher()->url(
                $request,
                ROUTE_PAGE,
                $journal->getPath(),
                'aitd',
                'index'
            ),
            'name' => __('plugins.generic.aitd.navMenuItem'),
            'isActive' => $request->getRequestedPage() === 'aitd'
        ];

        // Add after "About" or at the end
        $newNav = [];
        $inserted = false;
        foreach ($primaryNav as $item) {
            $newNav[] = $item;
            if (isset($item['name']) && $item['name'] === __('navigation.about')) {
                $newNav[] = $aitdNavItem;
                $inserted = true;
            }
        }
        if (!$inserted) {
            $newNav[] = $aitdNavItem;
        }

        $templateMgr->assign('primaryNav', $newNav);
    }

    /**
     * Get the plugin URL.
     */
    public function getPluginUrl()
    {
        return $this->getPluginPath();
    }

    /**
     * @copydoc Plugin::getActions()
     */
    public function getActions($request, $actionArgs)
    {
        $actions = parent::getActions($request, $actionArgs);
        if (!$this->getEnabled()) {
            return $actions;
        }

        $router = $request->getRouter();
        import('lib.pkp.classes.linkAction.request.AjaxModal');
        $linkAction = new LinkAction(
            'settings',
            new AjaxModal(
                $router->url($request, null, null, 'manage', null, ['verb' => 'settings', 'plugin' => $this->getName(), 'category' => 'generic']),
                $this->getDisplayName()
            ),
            __('manager.plugins.settings'),
            null
        );

        array_unshift($actions, $linkAction);
        return $actions;
    }

    /**
     * @copydoc Plugin::manage()
     */
    public function manage($args, $request)
    {
        switch ($request->getUserVar('verb')) {
            case 'settings':
                $templateMgr = TemplateManager::getManager($request);
                $form = new AitdSettingsForm($this);
                $form->initData();
                return new JSONMessage(true, $form->fetch($request));
            default:
                return parent::manage($args, $request);
        }
    }
}

/**
 * AITD Settings Form
 */
import('lib.pkp.classes.form.Form');

class AitdSettingsForm extends Form
{
    /** @var AitdPlugin */
    protected $plugin;

    /**
     * Constructor
     */
    public function __construct($plugin)
    {
        parent::__construct($plugin->getTemplateResource('settings.tpl'));
        $this->plugin = $plugin;
    }

    /**
     * @copydoc Form::initData()
     */
    public function initData()
    {
        $request = Application::get()->getRequest();
        $journal = $request->getContext();
        $this->setData('enabled', $this->plugin->getEnabled());
        $this->setData('includeInMenu', $this->plugin->getSetting($journal->getId(), 'includeInMenu'));
    }

    /**
     * @copydoc Form::readInputData()
     */
    public function readInputData()
    {
        $this->readUserVals(['includeInMenu']);
    }

    /**
     * @copydoc Form::execute()
     */
    public function execute(...$functionArgs)
    {
        $request = Application::get()->getRequest();
        $journal = $request->getContext();
        $this->plugin->updateSetting($journal->getId(), 'includeInMenu', $this->getData('includeInMenu'));
        parent::execute(...$functionArgs);
    }
}
