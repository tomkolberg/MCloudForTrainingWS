/**
 * Supporting functions for partners
 */
load("Scripts\\Base.js");

function translateSalutationToDocLanguage(language, salutationInput){
	var translatedSalutation = "";
	switch (language.toString()) {
	case "en":
		if (salutationInput.toString().slice(0,4) == "Herr") {
			translatedSalutation = "Mr.";
		}
		else if (salutationInput.toString().slice(0,4) == "Frau")
			translatedSalutation = "Mrs.";
		break;
		// in other cases no salutation to support "Dear Tom" e.g.
	case "de":		// fall-thru to default
	default:		// assume mapped salutation from XML is in de - so no change necessary
		translatedSalutation = salutationInput
		break;
	}
	return translatedSalutation;
}

function translateSalutatoryAddressToEn(salutatoryAddress){
	var translation = "";
	var strSalut = salutatoryAddress.toString();
	if (strSalut.slice(0, 4) == "Herr") {
		translation =  " Mr. " + $Partner.SalutatoryAddress.slice(5);
	}
	else if (strSalut.slice(0, 4) == "Frau") {
		translation =  "Mrs. " + strSalut.slice(5);
	}
	else if (strSalut.slice(0, 19) == "Sehr geehrter Herr ") {
		translation = "Dear Mr. " + strSalut.slice(19);
	}
	else if (strSalut.slice(0, 18) == "Sehr geehrte Frau ") {
		translation = "Dear Mrs. " + strSalut.slice(18);
	}	
	else if (strSalut.slice(0, 10) == "Moin Herr ") {
		translation = "Good Morning Mr. " + strSalut.slice(9);
	}
	else if (strSalut.slice(0, 10) == "Moin Frau ") {
		translation = "Good Morning Mrs. " + strSalut.slice(9);
	}		
	else if (strSalut.slice(0, 6) == "Hallo ") {
		translation = salutatoryAddress;
	}	
	else {
		translation = "Dear " + salutatoryAddress;
	}	
	return translation; 
}

function deriveSalutatoryAddress($Partner, $documentLanguage) 
{
	var language = FW_I18n.toLanguage($documentLanguage); 
	
	if (language == "de")
	{
		if (!$Partner.SalutatoryAddress || $Partner.SalutatoryAddress.isAbsent() || $Partner.SalutatoryAddress.isEmpty()) {
			if (!$Partner.Salutation || $Partner.Salutation.isAbsent() || $Partner.Salutation.isEmpty() || $Partner.Salutation == "Firma") {
				return "Sehr geehrte Damen und Herren";
			} 
			else {
				var name = "Sehr geehrte";
				if (("" + $Partner.Salutation).slice(0, 4) == "Herr") {
					name = name + "r Herr";
				}
				else if (("" + $Partner.Salutation).slice(0, 4) == "Frau") {
					name = name + " Frau";
				}
				if ($Partner.Title && !$Partner.Title.isEmpty()) {
					name = name + " " + $Partner.Title;
				}
				return name + " " + $Partner.Lastname;
			}
		} 
		else if (("" + $Partner.SalutatoryAddress).slice(0, 4) == "Herr") {
			return "Sehr geehrter " + $Partner.SalutatoryAddress;
		}
		else if (("" + $Partner.SalutatoryAddress).slice(0, 4) == "Frau") {
			return "Sehr geehrte " + $Partner.SalutatoryAddress;
		}
		else if (("" + $Partner.SalutatoryAddress).slice(0, 4) == "Sehr" || ("" + $Partner.SalutatoryAddress).slice(0, 4) == "Hall") {
			return $Partner.SalutatoryAddress;
		}
		else {
			return "Sehr geehrte(r) " + $Partner.SalutatoryAddress;
		}
	}
	else if (language == "en")
	{
		if (!$Partner.SalutatoryAddress || $Partner.SalutatoryAddress.isAbsent() || $Partner.SalutatoryAddress.isEmpty()) {
			if (!$Partner.Salutation || $Partner.Salutation.isAbsent() || $Partner.Salutation.isEmpty() || $Partner.Salutation == "Company") {
				return "Dear Ladies and Gentlemen";
			} 
			else 
			{
				var transSalutation = translateSalutationToDocLanguage(language, $Partner.Salutation);
				print ("Partner.Salutation Translated " + transSalutation + " " + $Partner.Lastname);
				if ($Partner.Title.toString() != "")	
				{
					return "Dear " + transSalutation + " " + $Partner.Title + " " + $Partner.Lastname ;
				}
				else 
				{
					return "Dear " + transSalutation + " " + $Partner.Lastname;
				}
			}
		} 
		else {
			var transSalutation = translateSalutatoryAddressToEn($Partner.SalutatoryAddress);
			print ("Partner.SalutatoryAddress = "+ $Partner.SalutatoryAddress + " --- " + transSalutation);			
			return transSalutation;
		}
	}	 
}


function deriveNameFirstname($Partner) {
	if ($Partner.CompanyName1 && !$Partner.CompanyName1.isEmpty()) {
		return $Partner.CompanyName1;
	}
	else {
		var name = $Partner.Lastname;
		if ($Partner.Firstname && !$Partner.Firstname.isEmpty()) {
			name = name + ", " + $Partner.Firstname;
		}
		if ($Partner.title && !$Partner.title.isEmpty()) {
			name = $Partner.title+ " " + name;
		}
		return name;
	}	
}