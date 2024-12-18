import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  smqSidebar: [
    {
      type: 'doc',
      id: 'index',
      label: 'Overview',
    },
    {
      type: 'doc',
      id: 'architecture',
      label: 'Architecture',
    },
    {
      type: 'category',
      label: 'Concepts',
      items: [
        {type: 'doc', id: 'entities'},
        {type: 'doc', id: 'authentication'},
        {type: 'doc', id: 'authorization'},
        {type: 'doc', id: 'roles'},
        {type: 'doc', id: 'authz-spec'},
        {type: 'doc', id: 'security'},
        {type: 'doc', id: 'messaging'},
      ],
    },
    {
      type: 'category',
      label: 'Quick Start',
      items: [
        {type: 'doc', id: 'getting-started'},
        {type: 'doc', id: 'api'},
        {type: 'doc', id: 'cli'},
      ],
    },
    {
      type: 'category',
      label: 'Development Tools',
      items: [
        {type: 'doc', id: 'dev-guide'},
        {type: 'doc', id: 'events'},
        {type: 'doc', id: 'tracing'},
      ],
    },
    {
      type: 'doc',
      id: 'storage', 
      label: 'Storage',
    },
    {
      type: 'doc',
      id: 'edge',
      label: 'Edge',
    },
    {
      type: 'doc',
      id: 'certs',
      label: 'Certs',
    },
    {
      type: 'doc',
      id: 'kubernetes',
      label: 'Kubernetes',
    },
    {
      type: 'category',
      label: 'Extensions',
      items: [
        {type: 'doc', id: 'smq-contrib'},
        {type: 'doc', id: 'lora'},
        {type: 'doc', id: 'opcua'}, 
        {type: 'doc', id: 'provision'},
        {type: 'doc', id: 'twins'},
        {type: 'doc', id: 'bootstrap'},
      ],
    },
    {
      type: 'doc',
      id: 'benchmark',
      label: 'Test Spec',
    },
  ],
};

export default sidebars;
