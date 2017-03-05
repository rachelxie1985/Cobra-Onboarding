using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Cobra_onboarding.Models
{
    public class CobraModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Town_City { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int PersonId { get; set; }
        public string ProductName { get; set; }
        public DateTime Date { get; set; }
        public decimal Price { get; set; }
        public string PersonName { get; set; }


    }
}