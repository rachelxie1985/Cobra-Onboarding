using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Cobra_onboarding.Startup))]
namespace Cobra_onboarding
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
