import 'package:args/args.dart';
import 'models/produit.dart';
import 'models/commande.dart';
import 'services/api_service.dart';

void main(List<String> arguments) async {
  final parser = ArgParser()
    ..addCommand('produits')
    ..addCommand('commandes')
    ..addCommand('ajouter-produit')
    ..addCommand('creer-commande');

  try {
    final results = parser.parse(arguments);
    final apiService = ApiService();

    if (results.command?.name == 'produits') {
      final produits = await apiService.getProduits();
      print('\nListe des produits:');
      produits.forEach((p) => p.afficherDetails());
    } else if (results.command?.name == 'commandes') {
      final commandes = await apiService.getCommandes();
      print('\nListe des commandes:');
      commandes.forEach((c) => c.afficherDetails());
    } else if (results.command?.name == 'ajouter-produit') {
      final produit = Produit(
        nom: 'Nouveau Produit',
        prix: 99.99,
        stock: 10,
        categorie: 'Electronique',
      );
      final added = await apiService.addProduit(produit);
      print('\nProduit ajouté avec succès:');
      added.afficherDetails();
    } else if (results.command?.name == 'creer-commande') {
      // Remplacer 1 par un ID de produit existant
      final commande = await apiService.addCommande(1, 2);
      print('\nCommande créée avec succès:');
      commande.afficherDetails();
    } else {
      print('''
Utilisation:
  dart run bin/main.dart produits          # Lister les produits
  dart run bin/main.dart commandes        # Lister les commandes
  dart run bin/main.dart ajouter-produit  # Ajouter un produit
  dart run bin/main.dart creer-commande   # Créer une commande
''');
    }
  } catch (e) {
    print('Erreur: $e');
  }
}
